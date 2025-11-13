import { Schema, model } from "mongoose";
import type { ICounter } from "../libs/types";

const counterSchema = new Schema<ICounter>({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

export const Counter = model<ICounter>("Counter", counterSchema);