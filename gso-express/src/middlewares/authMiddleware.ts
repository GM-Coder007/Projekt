import { NextFunction, Response } from "express";
import User from "../models/userModel";
import { Request } from "express-jwt";

export default async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.auth?.sub) {
    try {
      const user = await User.findById(req.auth.sub).exec();
      if (user) {
        if (user.twofa === false) req.user = user;
        else if (req.auth.twofa === true) req.user = user;
      }
    } catch (err) {}
  } /*else if (req.session.userId) {
    try {
      const user = await User.findById(req.session.userId).exec();
      if (user) {
        if (user.twofa === false) req.user = user;
        else if (req.session.twofa === true) req.user = user;
      }
    } catch (err) {}
  }*/
  next();
}
