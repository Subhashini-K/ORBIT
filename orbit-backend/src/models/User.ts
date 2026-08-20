import { Schema, model, type InferSchemaType, type HydratedDocument } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String }, // Optional for OAuth users
    avatarUrl: { type: String },
    provider: { type: String, enum: ["local", "google", "github"] }, // Auth provider
    providerId: { type: String }, // Provider's user ID (Google sub, GitHub id)
  },
  { timestamps: true }
);

export type UserDoc = HydratedDocument<InferSchemaType<typeof userSchema>>;

export const User = model("User", userSchema);
