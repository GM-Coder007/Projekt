import { Point } from "geojson";
import { Schema, model, Date } from "mongoose";

export interface IRawRoadQuality {
  start: Point;
  end: Point;
  measurements: [[number, number, number]];
  speed: number;
  createdAt: Date;
  updatedAt: Date;
}

const rawRoadQualitySchema = new Schema<IRawRoadQuality>(
  {
    start: { type: Schema.Types.Point, required: true },
    end: { type: Schema.Types.Point, required: true },
    measurements: { type: [[Number, Number, Number]], required: true },
    speed: { type: Number, required: true },
  },
  { timestamps: true }
);

const RawRoadQuality = model<IRawRoadQuality>(
  "RawRoadQuality",
  rawRoadQualitySchema
);

export default RawRoadQuality;
