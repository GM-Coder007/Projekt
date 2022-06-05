import { Point } from "geojson";
import { Schema, model, Date, Types } from "mongoose";

export interface IRoadQuality {
  start: Point;
  end: Point;
  quality: number;
  user: Types.ObjectId;
  drive: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const roadQualitySchema = new Schema<IRoadQuality>(
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
    quality: { type: Number, required: true },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    drive: {
      type: Schema.Types.ObjectId,
      ref: "Drive",
      required: true,
    },
  },
  { timestamps: true }
);

const RoadQuality = model<IRoadQuality>("RoadQuality", roadQualitySchema);

export default RoadQuality;
