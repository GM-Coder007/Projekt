import { Request, Response } from "express";
import StatusCodes from "http-status-codes";
import Drive, { IDrive } from "../models/driveModel";
import { Point } from "geojson";
import { CallbackError, HydratedDocument } from "mongoose";

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
  const name: string = req.body.name;
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

function drivePut(req: Request, res: Response) {
  const id: string = req.params.id;
  const name: string = req.body.name;
  const start: Point = req.body.start;
  const end: Point = req.body.end;
  const averageSpeed: number = req.body.averageSpeed;
  const maxSpeed: number = req.body.maxSpeed;

  Drive.findByIdAndUpdate(
    id,
    { start, end, averageSpeed, maxSpeed },
    function (err, drive) {
      if (err) {
        return res.status(INTERNAL_SERVER_ERROR).json({
          msg: "Server error.",
        });
      }

      if (!drive) {
        return res.status(NOT_FOUND).json({
          msg: "Drive with that id not found.",
        });
      }

      return res.status(OK).json(drive);
    }
  );
}

function driveDelete(req: Request, res: Response) {
  const id: string = req.params.id;

  Drive.findByIdAndRemove(
    id,
    function (err: CallbackError, drive: HydratedDocument<IDrive>) {
      if (err) {
        return res.status(INTERNAL_SERVER_ERROR).json({
          msg: "Server error.",
        });
      }

      if (!drive) {
        return res.status(NOT_FOUND).json({
          msg: "Drive with that id not found.",
        });
      }

      return res.status(NO_CONTENT).json();
    }
  );
}

export default {
  driveGet,
  drivePost,
  drivePut,
  driveDelete,
} as const;
