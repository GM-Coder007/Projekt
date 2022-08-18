import { Point } from "geojson";
import { Schema, model, Date, Types } from "mongoose";

export interface ISettings {
  _id: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
}

const settingsSchema = new Schema<ISettings>(
  {
    _id: String,
    value: String,
  },
  { timestamps: true }
);

const Settings = model<ISettings>("Settings", settingsSchema);

export default Settings;
