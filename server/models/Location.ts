import {  model } from "mongoose";
import type { ILocation } from "../libs/types";
import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    name: { type: String, required: false },
    address: {type: String, require: false },
    lat: { type: Number, required: true },
    lng: {type: Number, require: true },  
  },
  { timestamps: true }
);

export const Location = model<ILocation>("Location", locationSchema);
