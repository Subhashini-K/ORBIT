import { Schema, model, type InferSchemaType, type HydratedDocument } from "mongoose";
import { OAUTH_CONNECTOR_IDS } from "./OAuthToken.js";

/**
 * A browser full-page redirect to Google/GitHub can't carry an Authorization
 * header, so there's no JWT on the callback request. Instead, /authorize
 * stores a random single-use `state` value tied to the requesting user here,
 * hands that state to the provider, and /callback looks it up to recover
 * which Orbit user (and which connector) the callback belongs to. Also
 * doubles as CSRF protection — a callback with an unknown/expired state is
 * rejected.
 */
const oauthStateSchema = new Schema({
  state: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  connectorId: { type: String, enum: OAUTH_CONNECTOR_IDS, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 }, // TTL: 10 minutes
});

export type OAuthStateDoc = HydratedDocument<InferSchemaType<typeof oauthStateSchema>>;

export const OAuthState = model("OAuthState", oauthStateSchema);
