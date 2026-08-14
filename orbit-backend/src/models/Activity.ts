import { Schema, model, type InferSchemaType, type HydratedDocument } from "mongoose";
import { SOURCE_IDS } from "./Source.js";

const activitySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    sourceId: { type: String, enum: SOURCE_IDS, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export type ActivityDoc = HydratedDocument<InferSchemaType<typeof activitySchema>>;

export const Activity = model("Activity", activitySchema);
