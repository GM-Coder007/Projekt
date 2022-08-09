import { Request, Response } from "express";
import StatusCodes from "http-status-codes";
import RawRoadQuality from "../models/rawRoadQualityModel";
import { Point } from "geojson";
import RoadQuality from "../models/roadQualityModel";

const {
  OK,
  CREATED,
  NO_CONTENT,
  NOT_FOUND,
  UNAUTHORIZED,
  CONFLICT,
  INTERNAL_SERVER_ERROR,
} = StatusCodes;

const qualityTresholds = [
  [1, 1, 1],
  [2, 2, 2],
  [3, 3, 3],
  [4, 4, 4],
  [5, 5, 5],
  [6, 6, 6],
  [7, 7, 7],
  [8, 8, 8],
  [9, 9, 9],
  [10, 10, 10],
];

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
  const user = req.user?.id;
  if (!user) return res.status(UNAUTHORIZED).json({ msg: "No user found" });

  const start: Point = req.body.start;
  const end: Point = req.body.end;
  const measurements: [[number, number, number]] = req.body.measurements;
  const drive: string = req.body.drive;
  //const speed: number = req.body.speed;
  /*var roadQuality = new RawRoadQuality({
    start,
    end,
    measurements,
    drive,
    user,
  });*/

  let quality = 0;

  qualityTresholds.forEach(([x, y, z]) => {
    if (
      measurements[0][0] >= x ||
      measurements[0][1] >= y ||
      measurements[0][2] >= z
    ) {
      quality++;
      console.log;
    }
  });

  var roadQuality = new RoadQuality({ start, end, quality, drive, user });

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
} as const;
