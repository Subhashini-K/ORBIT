import { Schema, model, type InferSchemaType, type HydratedDocument } from "mongoose";
import { SOURCE_IDS } from "./Source.js";

const memorySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    brand: { type: String, enum: [...SOURCE_IDS, "memory"], required: true },
    occurredAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export type MemoryDoc = HydratedDocument<InferSchemaType<typeof memorySchema>>;

export const Memory = model("Memory", memorySchema);
