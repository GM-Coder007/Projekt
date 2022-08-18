import { Request, Response } from "express";
import StatusCodes from "http-status-codes";
import RawRoadQuality from "../models/rawRoadQualityModel";
import { Point } from "geojson";
import RoadQuality from "../models/roadQualityModel";
import { calculateQuality } from "../utils/qualityCalculation";

const {
  OK,
  CREATED,
  NO_CONTENT,
  NOT_FOUND,
  UNAUTHORIZED,
  CONFLICT,
  INTERNAL_SERVER_ERROR,
} = StatusCodes;

function rawroadqualityGet(req: Request, res: Response) {
  RawRoadQuality.find(function (err, roadquality) {
    if (err) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        msg: "Server error.",
      });
    }

    return res.json(roadquality);
  });
}

async function rawroadqualityPost(req: Request, res: Response) {
  const user = req.user?.id;
  if (!user) return res.status(UNAUTHORIZED).json({ msg: "No user found" });

  const start: Point = req.body.start;
  const end: Point = req.body.end;
  const measurements: [[number, number, number]] = req.body.measurements;
  const drive: string = req.body.drive;
  //const speed: number = req.body.speed;
  const rawRoadQuality = new RawRoadQuality({
    start,
    end,
    measurements,
    drive,
    user,
  });

  try {
    await rawRoadQuality.save();
  } catch (err) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      msg: "Server error.",
    });
  }

  const quality = calculateQuality(measurements);

  const roadQuality = new RoadQuality({ start, end, quality, drive, user });

  roadQuality.save(function (err, roadquality) {
    if (err) {
      console.log(err);
      return res.status(INTERNAL_SERVER_ERROR).json({
        msg: "Server error.",
      });
    }
    return res.status(CREATED).json(roadquality);
  });
}

export default {
  rawroadqualityGet,
  rawroadqualityPost,
  calculateQuality,
} as const;
