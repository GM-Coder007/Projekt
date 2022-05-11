import { Schema, model, Date } from "mongoose";

export interface IRoadQuality {
  long: number;
  lat: number;
  type: string;
  description?: string;
  createdAt: Date;
}

const roadQualitySchema = new Schema<IRoadQuality>({
  long: { type: Number, required: true },
  lat: { type: Number, required: true },
  type: { type: String, required: true },
  description: { type: String },
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
});

const RoadQuality = model<IRoadQuality>("RoadQuality", roadQualitySchema);

export default RoadQuality;
