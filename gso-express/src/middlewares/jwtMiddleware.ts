import { NextFunction, Response } from "express";
//import dotenv from "dotenv";
import StatusCodes from "http-status-codes";
import User, { IUser } from "../models/userModel";
import { Request } from "express-jwt";
import { CallbackError, HydratedDocument } from "mongoose";

//dotenv.config();

const { UNAUTHORIZED, INTERNAL_SERVER_ERROR } = StatusCodes;

export default function authorizeJWT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  /*const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.status(UNAUTHORIZED).json({ msg: "No token" });

  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (secret == null)
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ msg: "No configured secret" });

  try {
    const user: IUser = verify(token, secret) as IUser;
    req.user = user;
    next();
  } catch (err) {
    return res.sendStatus(UNAUTHORIZED);
  }
}*/

  if (req.auth?.sub) {
    User.findById(
      req.auth.sub,
      function (err: CallbackError, user: HydratedDocument<IUser>) {
        if (err)
          res.status(INTERNAL_SERVER_ERROR).json({ msg: "Server error" });
        if (!user) res.status(UNAUTHORIZED).json({ msg: "No user found" });
        req.user = user;
        next();
      }
    );
  }

  /*verify(token, secret, (err, userToken) => {
    if (err) return res.status(UNAUTHORIZED).json({ msg: "Invalid token" });
    if (userToken == null)
      return res.status(UNAUTHORIZED).json({ msg: "Invalid token" });

    User.findById(userToken.id, (err, user) => {
      if (err)
        return res.status(INTERNAL_SERVER_ERROR).json({ msg: "Server error" });
      if (user == null)
        return res.status(NOT_FOUND).json({ msg: "User not found" });

      req.user = user;
      next();
    });
    next();
  });*/
}
