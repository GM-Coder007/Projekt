import { Schema, model, Date } from "mongoose";

export interface IRoadQuality {
  long: number;
  lat: number;
  quality: number;
  createdAt: Date;
}

const roadQualitySchema = new Schema<IRoadQuality>({
  long: { type: Number, required: true },
  lat: { type: Number, required: true },
  quality: { type: Number, required: true },
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
});

const RoadQuality = model<IRoadQuality>("RoadQuality", roadQualitySchema);

export default RoadQuality;
