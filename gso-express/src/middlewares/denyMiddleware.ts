import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import { StatusCodes } from "http-status-codes";

const { UNAUTHORIZED } = StatusCodes;

export default async function denyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.user || req.machine) return next();
  else return res.status(UNAUTHORIZED).json({ message: "Unauthorized" });
}
