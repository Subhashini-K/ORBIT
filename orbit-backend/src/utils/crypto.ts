import crypto from "node:crypto";
import { env } from "../config/env.js";

/**
 * Encrypts/decrypts OAuth access & refresh tokens before they touch MongoDB.
 * Uses AES-256-GCM with a key from OAUTH_ENCRYPTION_KEY (32 bytes, hex-encoded).
 * Output format: "<ivHex>:<authTagHex>:<ciphertextHex>" — self-contained, so
 * no separate column is needed to store the IV/tag.
 */

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // recommended for GCM

function getKey(): Buffer {
  const key = Buffer.from(env.oauthEncryptionKey, "hex");
  if (key.length !== 32) {
    throw new Error(
      "OAUTH_ENCRYPTION_KEY must be a 32-byte value hex-encoded (64 hex chars). Generate one with: openssl rand -hex 32"
    );
  }
  return key;
}

/** Cheap upfront check so a missing/malformed key fails with a clear message before any OAuth flow starts. */
export function isEncryptionConfigured(): boolean {
  return Buffer.from(env.oauthEncryptionKey || "", "hex").length === 32;
}

export function encryptSecret(plainText: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${ciphertext.toString("hex")}`;
}

export function decryptSecret(payload: string): string {
  const [ivHex, authTagHex, ciphertextHex] = payload.split(":");
  if (!ivHex || !authTagHex || !ciphertextHex) {
    throw new Error("Malformed encrypted token payload.");
  }
  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), Buffer.from(ivHex, "hex"));
  decipher.setAuthTag(Buffer.from(authTagHex, "hex"));
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(ciphertextHex, "hex")),
    decipher.final(),
  ]);
  return plaintext.toString("utf8");
}

/** Cryptographically random URL-safe string, used for OAuth `state` values. */
export function randomState(): string {
  return crypto.randomBytes(24).toString("hex");
}
