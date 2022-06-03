import express, { Express, Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import StatusCodes from "http-status-codes";
import driveRoutes from "./routes/driveRoutes";
import rawRoadQualityRoutes from "./routes/rawRoadQualityRoutes";
import roadQualityRoutes from "./routes/roadQualityRoutes";
import roadWorksRoutes from "./routes/roadWorksRoutes";
import userRoutes from "./routes/userRoutes";

dotenv.config();

const port = process.env.PORT || 3000;
const mongoDB = process.env.MONGO_STRING || "mongodb://localhost/projekt";

//var mongoDB = "mongodb://localhost/projekt";
mongoose.connect(mongoDB);

const app: Express = express();

const allowedOrigins = ["http://localhost:3000", "http://localhost:4000"];
app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

app.use(
  session({
    secret: "prosim za dobro oceno",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: mongoDB }),
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const { NOT_FOUND } = StatusCodes;

app.use("/users", userRoutes);
app.use("/drives", driveRoutes);
app.use("/rawRoadQuality", rawRoadQualityRoutes);
app.use("/roadQuality", roadQualityRoutes);
app.use("/roadWorks", roadWorksRoutes);

app.use(function (req: Request, res: Response) {
  res.status(NOT_FOUND).json({ msg: "Not found" });
});

app.listen(port);
