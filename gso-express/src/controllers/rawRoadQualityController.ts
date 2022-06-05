import { Request, Response } from "express";
import StatusCodes from "http-status-codes";
import RawRoadQuality from "../models/rawRoadQualityModel";
import { Point } from "geojson";

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

function rawroadqualityPost(req: Request, res: Response) {
  const start: Point = req.body.start;
  const end: Point = req.body.end;
  const measurements: [[number, number, number]] = req.body.measurements;
  const speed: number = req.body.speed;
  var roadQuality = new RawRoadQuality({ start, end, measurements, speed });

  roadQuality.save(function (err, roadquality) {
    if (err) {
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
} as const;
