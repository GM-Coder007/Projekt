import { Point } from "geojson";
import { Schema, model, Date } from "mongoose";

export interface IDrive {
  start?: Point;
  end?: Point;
  averageSpeed?: number;
  maxSpeed?: number;
  createdAt: Date;
  updatedAt: Date;
}

const driveSchema = new Schema<IDrive>(
  {
    start: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    end: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    averageSpeed: { type: Number },
    maxSpeed: { type: Number },
  },
  { timestamps: true }
);

const Drive = model<IDrive>("Drive", driveSchema);

export default Drive;
