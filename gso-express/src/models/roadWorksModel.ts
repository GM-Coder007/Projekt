import { Point } from "geojson";
import { Schema, model, Date } from "mongoose";

export interface IRoadWorks {
  location: Point;
  type: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const roadWorksSchema = new Schema<IRoadWorks>(
  {
    location: { type: Schema.Types.Point, required: true },
    type: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

const RoadWorks = model<IRoadWorks>("RoadWorks", roadWorksSchema);

export default RoadWorks;
