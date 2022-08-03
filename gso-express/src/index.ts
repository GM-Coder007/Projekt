import express, {
  Express,
  NextFunction,
  Request,
  Response,
  Errback,
} from "express";
import cors from "cors";
import mongoose, { HydratedDocument } from "mongoose";
//import session from "express-session";
//import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import StatusCodes from "http-status-codes";
import driveRoutes from "./routes/driveRoutes";
import rawRoadQualityRoutes from "./routes/rawRoadQualityRoutes";
import roadQualityRoutes from "./routes/roadQualityRoutes";
import roadWorksRoutes from "./routes/roadWorksRoutes";
import userRoutes from "./routes/userRoutes";
import { IUser } from "./models/userModel";
import { expressjwt } from "express-jwt";

dotenv.config();

const domain = process.env.CORS_DOMAIN || "localhost:3000";
const port = process.env.PORT || 4000;
const mongoDB = process.env.MONGO_STRING || "mongodb://localhost/projekt";

mongoose.connect(mongoDB);

const app: Express = express();

const allowedOrigins = [
  "http://" + domain,
  "https://" + domain,
  "http://localhost:3000",
];
//console.log(allowedOrigins);

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

/*declare module "express-session" {
  interface SessionData {
    userId: string;
    twofa: boolean;
  }
}*/

declare module "express-serve-static-core" {
  interface Request {
    user?: HydratedDocument<IUser>;
    machine?: boolean;
  }
}

/*app.use(
  session({
    secret: "prosim za dobro oceno",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: mongoDB }),
  })
);*/

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  expressjwt({
    secret: process.env.ACCESS_TOKEN_SECRET || "DEFINE_ME",
    algorithms: ["HS256"],
    credentialsRequired: false,
    getToken: function fromHeaderOrQuerystring(req: Request) {
      if (
        req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === "Bearer" &&
        req.headers.authorization.split(" ")[1]
      ) {
        return req.headers.authorization.split(" ")[1];
      } else if (req.cookies.token) {
        return req.cookies.token;
      }
      return null;
    },
  }) //.unless({ path: ["/users/login", "/users/register"] })
);

app.use(function (
  err: Errback,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ msg: "Invalid token" });
  } else {
    next(err);
  }
});

app.use("/users", userRoutes);
app.use("/drives", driveRoutes);
app.use("/rawRoadQuality", rawRoadQualityRoutes);
app.use("/roadQuality", roadQualityRoutes);
app.use("/roadWorks", roadWorksRoutes);

const { NOT_FOUND } = StatusCodes;
app.use(function (req: Request, res: Response) {
  res.status(NOT_FOUND).json({ msg: "Not found" });
});

app.listen(port);
