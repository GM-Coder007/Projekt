import { Request, Response } from "express";
import StatusCodes from "http-status-codes";
import { HydratedDocument, CallbackError } from "mongoose";
import Drive, { IDrive } from "../models/driveModel";
import RoadQuality, { IRoadQuality } from "../models/roadQualityModel";
import RawRoadQuality, { IRawRoadQuality } from "../models/rawRoadQualityModel";
import RoadWorks, { IRoadWorks } from "../models/roadWorksModel";
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

function driveGet(req: Request, res: Response) {
  Drive.find(function (err, drive) {
    if (err) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        msg: "Server error.",
      });
    }

    return res.json(drive);
  });
}

function drivePost(req: Request, res: Response) {
  const start: Point = req.body.start;
  const end: Point = req.body.end;
  const averageSpeed: number = req.body.averageSpeed;
  const maxSpeed: number = req.body.maxSpeed;

  var driveS = new Drive({ start, end, averageSpeed, maxSpeed });

  driveS.save(function (err, drive) {
    if (err) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        msg: "Server error.",
      });
    }
    return res.status(CREATED).json(drive);
  });
}

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

function roadworksGet(req: Request, res: Response) {
  RoadWorks.find(function (err, roadWorks) {
    if (err) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        msg: "Server error.",
      });
    }

    return res.json(roadWorks);
  });
}

function roadworksPost(req: Request, res: Response) {
  const location: Point = req.body.location;
  const type: string = req.body.type;
  const description: string = req.body.description;

  var roadWorks = new RoadWorks({ location, type, description });

  roadWorks.save(function (err, roadworks) {
    if (err) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        msg: "Server error.",
      });
    }
    return res.status(CREATED).json(roadworks);
  });
}

export default {
  driveGet,
  drivePost,
  roadqualityGet,
  roadqualityPost,
  rawroadqualityGet,
  rawroadqualityPost,
  roadworksGet,
  roadworksPost,
} as const;
