import { Schema, model, type InferSchemaType, type HydratedDocument } from "mongoose";

const SOURCE_IDS = [
  "gmail",
  "google-calendar",
  "google-drive",
  "github",
  "photos",
  "notes",
  "spotify",
  "whatsapp",
] as const;

const sourceSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    sourceId: { type: String, enum: SOURCE_IDS, required: true },
    name: { type: String, required: true },
    status: {
      type: String,
      enum: ["connected", "disconnected", "error", "syncing"],
      default: "disconnected",
    },
    meta: { type: String },
    lastSyncedAt: { type: Date },
  },
  { timestamps: true }
);

// One document per (user, sourceId) pair.
sourceSchema.index({ userId: 1, sourceId: 1 }, { unique: true });

export type SourceDoc = HydratedDocument<InferSchemaType<typeof sourceSchema>>;

export const Source = model("Source", sourceSchema);
export { SOURCE_IDS };
