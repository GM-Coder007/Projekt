import { Point } from "geojson";
import { Schema, model, Date } from "mongoose";

export interface IRoadWorks {
  title: string;
  summary?: string;
  createdAt: Date;
  updatedAt: Date;
}

const roadWorksSchema = new Schema<IRoadWorks>(
  {
    title: { type: String, required: true },
    summary: { type: String },
  },
  { timestamps: true }
);

const RoadWorks = model<IRoadWorks>("RoadWorks", roadWorksSchema);

export default RoadWorks;
