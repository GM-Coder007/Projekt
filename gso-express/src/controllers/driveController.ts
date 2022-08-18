import { Request, Response } from "express";
import StatusCodes from "http-status-codes";
import { CallbackError, HydratedDocument } from "mongoose";
import Drive, { IDrive } from "../models/driveModel";
import RawRoadQuality from "../models/rawRoadQualityModel";
import RoadQuality from "../models/roadQualityModel";
import { calculateQuality } from "../utils/qualityCalculation";

const {
  OK,
  CREATED,
  NO_CONTENT,
  NOT_FOUND,
  UNAUTHORIZED,
  FORBIDDEN,
  CONFLICT,
  INTERNAL_SERVER_ERROR,
} = StatusCodes;

function driveGet(req: Request, res: Response) {
  const user = req.user?.id;
  if (!user) return res.status(UNAUTHORIZED).json({ msg: "No user found" });
  Drive.find({ user })
    .sort("-createdAt")
    .exec(function (err, drive) {
      if (err) {
        return res.status(INTERNAL_SERVER_ERROR).json({
          msg: "Server error.",
        });
      }

      return res.json(drive);
    });
}

async function drivePost(req: Request, res: Response) {
  const user = req.user?.id;
  if (!user) return res.status(UNAUTHORIZED).json({ msg: "No user found" });

  var drive = new Drive();
  if (req.body.name) drive.name = req.body.name;
  /*if (req.body.start) drive.start = req.body.start;
  if (req.body.end) drive.end = req.body.end;
  if (req.body.averageSpeed) drive.averageSpeed = req.body.averageSpeed;
  if (req.body.maxSpeed) drive.maxSpeed = req.body.maxSpeed;*/
  drive.user = user;

  try {
    await drive.save();
  } catch (err) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      msg: "Server error.",
    });
  }

  return res.status(CREATED).json(drive);
}

async function drivePut(req: Request, res: Response) {
  const user = req.user?.id;
  if (!user) return res.status(UNAUTHORIZED).json({ msg: "No user found" });

  const id = req.params.id;

  let drive;
  try {
    drive = await Drive.findById(id).exec();
  } catch (err) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      msg: "Server error.",
    });
  }

  if (!drive) {
    return res.status(NOT_FOUND).json({
      msg: "Drive with that id not found.",
    });
  }

  if (drive.user.toString() !== user)
    return res
      .status(FORBIDDEN)
      .json({ msg: "You don't have access to this resource" });

  drive.name = req.body.name ? req.body.name : drive.name;
  /*drive.start = req.body.start ? req.body.start : drive.start;
  drive.end = req.body.end ? req.body.end : drive.end;
  drive.averageSpeed = req.body.averageSpeed
    ? req.body.averageSpeed
    : drive.averageSpeed;
  drive.maxSpeed = req.body.maxSpeed ? req.body.maxSpeed : drive.maxSpeed;*/

  try {
    await drive.save();
  } catch (err) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      msg: "Server error.",
    });
  }

  return res.status(OK).json(drive);
}

async function driveDelete(req: Request, res: Response) {
  const id: string = req.params.id;

  try {
    await RawRoadQuality.deleteMany({ drive: id });
  } catch (err) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      msg: "Server error.",
    });
  }

  try {
    await RoadQuality.deleteMany({ drive: id });
  } catch (err) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      msg: "Server error.",
    });
  }

  let drive;
  try {
    drive = await Drive.findByIdAndRemove(id).exec();
  } catch (err) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      msg: "Server error.",
    });
  }

  if (!drive) {
    return res.status(NOT_FOUND).json({
      msg: "Drive with that id not found.",
    });
  }
  return res.json(drive);
}

async function driveRecalculate(req: Request, res: Response) {
  try {
    await RoadQuality.deleteMany({});
  } catch (err) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      msg: "Server error.",
    });
  }

  let quality;
  try {
    quality = await RawRoadQuality.find().exec();
  } catch (err) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      msg: "Server error.",
    });
  }

  quality.forEach(async (quality) => {
    const roadQuality = new RoadQuality();
    roadQuality.drive = quality.drive;
    roadQuality.quality = calculateQuality(quality.measurements);
    //roadQuality.createdAt = quality.createdAt;
    //roadQuality.updatedAt = quality.updatedAt;
    roadQuality.user = quality.user;
    try {
      await roadQuality.save();
    } catch (err) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        msg: "Server error.",
      });
    }
  });
}

export default {
  driveGet,
  drivePost,
  drivePut,
  driveDelete,
  driveRecalculate,
} as const;
