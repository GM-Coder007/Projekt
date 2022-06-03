import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import StatusCodes from "http-status-codes";

dotenv.config();

const { UNAUTHORIZED, INTERNAL_SERVER_ERROR } = StatusCodes;

export default function authorizeAPI(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  const key = authHeader && authHeader.split(" ")[1];
  if (key == null) return res.status(UNAUTHORIZED).json({ msg: "No API key" });

  const apiKey = process.env.API_KEY;
  if (apiKey == null)
    return res.status(INTERNAL_SERVER_ERROR).json({ msg: "Undefined API key" });
  if (apiKey === key) next();
}
