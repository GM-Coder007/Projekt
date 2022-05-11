import { Request, Response } from "express";
import StatusCodes from "http-status-codes";
import { HydratedDocument, CallbackError } from "mongoose";
import RoadQuality, { IRoadQuality } from "../models/roadQualityModel";
import RoadWorks, { IRoadWorks } from "../models/roadWorksModel";

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
  RoadQuality.find(function (
    err: CallbackError,
    roadquality: HydratedDocument<IRoadQuality>
  ) {
    if (err) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        msg: "Server error.",
      });
    }

    return res.json(roadquality);
  });
}

function roadqualityPost(req: Request, res: Response) {
  const long: number = req.body.long;
  const lat: number = req.body.lat;
  const quality: number = req.body.quality;

  var roadQuality = new RoadQuality({ long, lat, quality });

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
  RoadWorks.find(function (
    err: CallbackError,
    roadWorks: HydratedDocument<IRoadWorks>
  ) {
    if (err) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        msg: "Server error.",
      });
    }

    return res.json(roadWorks);
  });
}

function roadworksPost(req: Request, res: Response) {
  const long: number = req.body.long;
  const lat: number = req.body.lat;
  const type: string = req.body.type;
  const description: string = req.body.description;

  var roadWorks = new RoadWorks({ long, lat, type, description });

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
  roadqualityGet,
  roadqualityPost,
  roadworksGet,
  roadworksPost,
} as const;
