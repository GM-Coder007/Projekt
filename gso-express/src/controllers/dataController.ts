import { Request, Response } from "express";
import StatusCodes from "http-status-codes";
import { HydratedDocument, CallbackError } from "mongoose";
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

  roadWorks.save(function (err, user) {
    if (err) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        msg: "Server error.",
      });
    }
    return res.status(CREATED).json(roadWorks);
  });
}

export default {
  roadworksGet,
  roadworksPost,
} as const;
