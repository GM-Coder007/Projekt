import { Schema, model, Date } from "mongoose";

export interface IRoadWorks {
  long: number;
  lat: number;
  type: string;
  description?: string;
  createdAt: Date;
}

const roadWorksSchema = new Schema<IRoadWorks>({
  long: { type: Number, required: true },
  lat: { type: Number, required: true },
  type: { type: String, required: true },
  description: { type: String },
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
});

const RoadWorks = model<IRoadWorks>("RoadWorks", roadWorksSchema);

export default RoadWorks;
