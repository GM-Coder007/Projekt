import { Point } from "geojson";
import { Schema, model, Date } from "mongoose";

export interface IRoadQuality {
  start: Point;
  end: Point;
  quality: number;
  createdAt: Date;
  updatedAt: Date;
}

const roadQualitySchema = new Schema<IRoadQuality>(
  {
    start: { type: Schema.Types.Point, required: true },
    end: { type: Schema.Types.Point, required: true },
    quality: { type: Number, required: true },
  },
  { timestamps: true }
);

const RoadQuality = model<IRoadQuality>("RoadQuality", roadQualitySchema);

export default RoadQuality;
