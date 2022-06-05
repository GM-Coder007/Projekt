import { Request, Response } from "express";
import StatusCodes from "http-status-codes";
import RoadQuality from "../models/roadQualityModel";
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

function roadqualityGet(req: Request, res: Response) {
  RoadQuality.find(function (err, roadquality) {
    if (err) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        msg: "Server error.",
      });
    }

    return res.json(roadquality);
  });
}

function roadqualityPost(req: Request, res: Response) {
  const start: Point = req.body.start;
  const end: Point = req.body.end;
  const quality: number = req.body.quality;

  var roadQuality = new RoadQuality({ start, end, quality });

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
  roadqualityGet,
  roadqualityPost,
} as const;
