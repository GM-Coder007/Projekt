import { Request, Response } from "express";
import StatusCodes from "http-status-codes";
import Drive from "../models/driveModel";
import Settings from "../models/settingsModel";

const { CREATED, BAD_REQUEST, INTERNAL_SERVER_ERROR } = StatusCodes;

function settingsGet(req: Request, res: Response) {
  Settings.find().exec(function (err, settings) {
    if (err) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        msg: "Server error.",
      });
    }
    return res.json({ settings: settings });
  });
}

async function settingsPost(req: Request, res: Response) {
  /*const user = req.user?.id;
  if (!user) return res.status(UNAUTHORIZED).json({ msg: "No user found" });*/

  //const setting = new Settings();
  if (!(req.body.key && req.body.value))
    return res.status(BAD_REQUEST).json({ msg: "No key or value found" });

  let setting;
  try {
    setting = await Settings.findById(req.body.key);
  } catch (err) {
    return res.status(INTERNAL_SERVER_ERROR).json({ msg: "Server error", err });
  }

  if (!setting) setting = new Settings();

  setting._id = req.body.key;
  setting.value = req.body.value;

  try {
    await setting.save();
  } catch (err) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      msg: "Server error.",
    });
  }

  return res.status(CREATED).json(setting);
}

export default {
  settingsGet,
  settingsPost,
} as const;
