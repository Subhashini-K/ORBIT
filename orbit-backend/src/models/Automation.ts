import { Schema, model, type InferSchemaType, type HydratedDocument } from "mongoose";
import { SOURCE_IDS } from "./Source.js";

const automationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    slug: { type: String, required: true }, // stable id used by the frontend, e.g. "inbox-digest"
    name: { type: String, required: true },
    description: { type: String, required: true },
    brand: { type: String, enum: [...SOURCE_IDS, "memory"], required: true },
    enabled: { type: Boolean, default: false },
    frequency: { type: String, required: true },
    lastRun: { type: Date },
  },
  { timestamps: true }
);

automationSchema.index({ userId: 1, slug: 1 }, { unique: true });

export type AutomationDoc = HydratedDocument<InferSchemaType<typeof automationSchema>>;

export const Automation = model("Automation", automationSchema);
