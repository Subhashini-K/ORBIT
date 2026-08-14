import { OAuthToken } from "../../models/OAuthToken.js";
import { OAuthState } from "../../models/OAuthState.js";
import { Source } from "../../models/Source.js";
import { ApiError } from "../../utils/ApiError.js";
import { encryptSecret, decryptSecret, randomState, isEncryptionConfigured } from "../../utils/crypto.js";
import { CONNECTOR_REGISTRY, type ConnectorId, type OAuthProviderName } from "./oauth.registry.js";
import { PROVIDERS } from "./oauth.providers.js";
import { runSync } from "./oauth.connectors.js";

/** Step 1: called from the protected /oauth/:connectorId/authorize route. */
export async function createAuthorizeUrl(userId: string, connectorId: ConnectorId): Promise<string> {
  if (!isEncryptionConfigured()) {
    throw ApiError.badRequest(
      "OAUTH_ENCRYPTION_KEY isn't set (or isn't a 32-byte hex value) on the server. Generate one with `openssl rand -hex 32`, set it, and restart the server."
    );
  }

  const config = CONNECTOR_REGISTRY[connectorId];
  const provider = PROVIDERS[config.provider];
  provider.assertConfigured();

  const state = randomState();
  await OAuthState.create({ state, userId, connectorId });

  return provider.buildAuthorizeUrl(config.scopes, state);
}

interface CallbackParams {
  providerName: OAuthProviderName;
  code?: string;
  state?: string;
  error?: string;
}

interface CallbackResult {
  connectorId: ConnectorId;
  status: "success" | "error";
  message?: string;
}

/** Step 2: called from the public /oauth/:provider/callback route. */
export async function handleCallback(params: CallbackParams): Promise<CallbackResult> {
  const { providerName, code, state, error } = params;

  // The provider itself reported a problem (e.g. the user hit "Cancel").
  if (error) {
    const connectorId = state ? (await OAuthState.findOneAndDelete({ state }))?.connectorId : undefined;
    return {
      connectorId: (connectorId as ConnectorId) ?? guessFallbackConnector(providerName),
      status: "error",
      message: error === "access_denied" ? "Authorization was cancelled." : error,
    };
  }

  if (!code || !state) {
    return { connectorId: guessFallbackConnector(providerName), status: "error", message: "Missing code or state." };
  }

  // Single-use state lookup — also our CSRF protection.
  const stateDoc = await OAuthState.findOneAndDelete({ state });
  if (!stateDoc) {
    return {
      connectorId: guessFallbackConnector(providerName),
      status: "error",
      message: "This authorization link is invalid or has expired. Please try connecting again.",
    };
  }

  const connectorId = stateDoc.connectorId as ConnectorId;
  const userId = stateDoc.userId.toString();
  const config = CONNECTOR_REGISTRY[connectorId];
  const provider = PROVIDERS[config.provider];

  try {
    const tokens = await provider.exchangeCode(code);

    await OAuthToken.findOneAndUpdate(
      { userId, connectorId },
      {
        userId,
        connectorId,
        provider: config.provider,
        accessTokenEnc: encryptSecret(tokens.accessToken),
        refreshTokenEnc: tokens.refreshToken ? encryptSecret(tokens.refreshToken) : undefined,
        scope: tokens.scope,
        expiresAt: tokens.expiresAt,
      },
      { upsert: true, setDefaultsOnInsert: true }
    );

    await Source.findOneAndUpdate(
      { userId, sourceId: connectorId },
      { status: "connected", lastSyncedAt: new Date() }
    );

    // Best-effort initial sync — a failure here shouldn't undo the connection,
    // it just means the source shows "Connected" with no data yet.
    try {
      const accessToken = await getValidAccessToken(userId, connectorId);
      const result = await runSync(connectorId, userId, accessToken);
      await Source.findOneAndUpdate({ userId, sourceId: connectorId }, { meta: result.meta, lastSyncedAt: new Date() });
    } catch (syncErr) {
      console.error(`[oauth] Initial sync failed for ${connectorId}:`, syncErr);
    }

    return { connectorId, status: "success" };
  } catch (err) {
    console.error(`[oauth] Callback failed for ${connectorId}:`, err);
    await Source.findOneAndUpdate({ userId, sourceId: connectorId }, { status: "error" });
    return {
      connectorId,
      status: "error",
      message: err instanceof ApiError ? err.message : "Something went wrong completing the connection.",
    };
  }
}

/** Returns a live access token, refreshing it first if it's expired. */
export async function getValidAccessToken(userId: string, connectorId: ConnectorId): Promise<string> {
  const tokenDoc = await OAuthToken.findOne({ userId, connectorId });
  if (!tokenDoc) {
    throw ApiError.notFound(`${connectorId} is not connected.`);
  }

  const isExpired = tokenDoc.expiresAt && tokenDoc.expiresAt.getTime() < Date.now() + 30_000;
  if (!isExpired) {
    return decryptSecret(tokenDoc.accessTokenEnc);
  }

  if (!tokenDoc.refreshTokenEnc) {
    throw ApiError.unauthorized(`${connectorId}'s connection expired. Please reconnect.`);
  }

  const config = CONNECTOR_REGISTRY[connectorId];
  const provider = PROVIDERS[config.provider];
  const refreshed = await provider.refreshAccessToken(decryptSecret(tokenDoc.refreshTokenEnc));

  tokenDoc.accessTokenEnc = encryptSecret(refreshed.accessToken);
  tokenDoc.expiresAt = refreshed.expiresAt;
  await tokenDoc.save();

  return refreshed.accessToken;
}

/** Disconnect: revoke upstream (best-effort), delete the token, reset the Source. */
export async function disconnectConnector(userId: string, connectorId: ConnectorId): Promise<void> {
  const tokenDoc = await OAuthToken.findOne({ userId, connectorId });

  if (tokenDoc) {
    const config = CONNECTOR_REGISTRY[connectorId];
    const provider = PROVIDERS[config.provider];
    try {
      await provider.revoke(decryptSecret(tokenDoc.accessTokenEnc));
    } catch (err) {
      console.error(`[oauth] Revoke failed for ${connectorId} (continuing with local cleanup):`, err);
    }
    await OAuthToken.deleteOne({ _id: tokenDoc._id });
  }

  await Source.findOneAndUpdate(
    { userId, sourceId: connectorId },
    { status: "disconnected", meta: undefined, lastSyncedAt: undefined }
  );
}

/** Used only when we can't recover a connectorId from a broken/missing state (e.g. tampered callback). */
function guessFallbackConnector(providerName: OAuthProviderName): ConnectorId {
  return providerName === "github" ? "github" : "gmail";
}
