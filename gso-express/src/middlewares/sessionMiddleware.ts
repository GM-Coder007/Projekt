import { NextFunction, Request, Response } from "express";
import StatusCodes from "http-status-codes";
import User, { IUser } from "../models/userModel";
import { CallbackError, HydratedDocument } from "mongoose";

const { UNAUTHORIZED, INTERNAL_SERVER_ERROR } = StatusCodes;

export default function authorizeSession(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.session.userId) {
    User.findById(
      req.session.userId,
      function (err: CallbackError, user: HydratedDocument<IUser>) {
        if (err)
          res.status(INTERNAL_SERVER_ERROR).json({ msg: "Server error" });
        if (!user) res.status(UNAUTHORIZED).json({ msg: "No user found" });
        req.user = user;
        next();
      }
    );
  }
}
