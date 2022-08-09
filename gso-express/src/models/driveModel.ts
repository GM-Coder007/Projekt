import { Point } from "geojson";
import { Schema, model, Date, Types } from "mongoose";

export interface IDrive {
  name?: string;
  /*start?: Point;
  end?: Point;
  averageSpeed?: number;
  maxSpeed?: number;*/
  user: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const driveSchema = new Schema<IDrive>(
  {
    name: String,
    /*start: {
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
    maxSpeed: { type: Number },*/
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Drive = model<IDrive>("Drive", driveSchema);

export default Drive;
