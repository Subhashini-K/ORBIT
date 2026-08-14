import { Schema, model, type InferSchemaType, type HydratedDocument } from "mongoose";

/** The subset of SOURCE_IDS that have a real OAuth integration. */
const OAUTH_CONNECTOR_IDS = ["gmail", "google-calendar", "google-drive", "github"] as const;

const oauthTokenSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    connectorId: { type: String, enum: OAUTH_CONNECTOR_IDS, required: true },
    provider: { type: String, enum: ["google", "github"], required: true },

    // AES-256-GCM encrypted (see utils/crypto.ts) — never stored in plaintext.
    accessTokenEnc: { type: String, required: true },
    refreshTokenEnc: { type: String },

    scope: { type: String },
    expiresAt: { type: Date }, // undefined/absent means the token doesn't expire (e.g. GitHub OAuth Apps)
  },
  { timestamps: true }
);

// One token document per (user, connector) — re-connecting upserts instead
// of creating a duplicate row.
oauthTokenSchema.index({ userId: 1, connectorId: 1 }, { unique: true });

export type OAuthTokenDoc = HydratedDocument<InferSchemaType<typeof oauthTokenSchema>>;

export const OAuthToken = model("OAuthToken", oauthTokenSchema);
export { OAUTH_CONNECTOR_IDS };
