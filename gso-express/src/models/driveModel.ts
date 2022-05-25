import { Point } from "geojson";
import { Schema, model, Date } from "mongoose";

export interface IRoadQuality {
  start?: Point;
  end?: Point;
  averageSpeed?: number;
  maxSpeed?: number;
  createdAt: Date;
  updatedAt: Date;
}

const roadQualitySchema = new Schema<IRoadQuality>(
  {
    start: { type: Schema.Types.Point },
    end: { type: Schema.Types.Point },
    averageSpeed: Number,
    maxSpeed: Number,
  },
  { timestamps: true }
);

const RoadQuality = model<IRoadQuality>("RoadQuality", roadQualitySchema);

export default RoadQuality;
