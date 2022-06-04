import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

export default function apiMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  const key = authHeader && authHeader.split(" ")[1];

  if (key && key === process.env.API_KEY) {
    req.machine = true;
  }
  next();
}
