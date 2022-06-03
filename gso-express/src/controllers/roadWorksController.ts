import { Request, Response } from "express";
import StatusCodes from "http-status-codes";
import RoadWorks from "../models/roadWorksModel";
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
  roadworksGet,
  roadworksPost,
} as const;
