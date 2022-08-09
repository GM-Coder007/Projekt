import { Point } from "geojson";
import { Schema, model, Date, Types } from "mongoose";

export interface IRawRoadQuality {
  start: Point;
  end: Point;
  measurements: [[number, number, number]];
  //speed: number;
  user: Types.ObjectId;
  drive: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const rawRoadQualitySchema = new Schema<IRawRoadQuality>(
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
    measurements: { type: [[Number, Number, Number]], required: true },
    //speed: { type: Number, required: true },
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

const RawRoadQuality = model<IRawRoadQuality>(
  "RawRoadQuality",
  rawRoadQualitySchema
);

export default RawRoadQuality;
