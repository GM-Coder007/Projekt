import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import StatusCodes from "http-status-codes";
import userRoutes from "./routes/userRoutes";
import dataRoutes from "./routes/dataRoutes";
//import voznjaRoutes from "./routes/voznjaRoutes";

dotenv.config();

const port = process.env.PORT || 3000;
const mongoDB = process.env.MONGO_STRING || "mongodb://localhost/projekt";

//var mongoDB = "mongodb://localhost/projekt";
mongoose.connect(mongoDB);

const app: Express = express();

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
app.use("/data", dataRoutes);
//app.use('/voznja', voznjaRoutes);

app.use(function (req: Request, res: Response) {
  res.status(NOT_FOUND).json({ msg: "Not found" });
});

app.listen(port);
