import { Request, Response } from "express";
import StatusCodes from "http-status-codes";
import { HydratedDocument, CallbackError } from "mongoose";
import bcrypt from "bcrypt";
import User, { IUser } from "../models/userModel";

const {
  OK,
  CREATED,
  NO_CONTENT,
  NOT_FOUND,
  UNAUTHORIZED,
  CONFLICT,
  INTERNAL_SERVER_ERROR,
} = StatusCodes;

async function login(req: Request, res: Response) {
  const email: string = req.body.email;
  const password: string = req.body.password;

  User.authenticate(email, password, function (error, user) {
    if (error) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        msg: "Server error.",
      });
    } else if (!user) {
      return res.status(UNAUTHORIZED).json({
        msg: "Wrong username or password.",
      });
    } else {
      req.session.userId = user._id.toString();

      return res.json({
        _id: user._id,
        email: user.email,
        createdAt: user.createdAt,
      });
    }
  });
}

async function register(req: Request, res: Response) {
  const email: string = req.body.email;
  const password: string = req.body.password;

  try {
    var userCheck = await User.findOne({ email }).exec();

    if (userCheck)
      return res.status(CONFLICT).json({
        msg: "Already registered with this email.",
      });
  } catch (err) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      msg: "Server error.",
    });
  }

  var user = new User({ email, password });

  user.save(function (err, user) {
    if (err) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        msg: "Server error.",
      });
    }
    return res
      .status(CREATED)
      .json({ _id: user._id, email: user.email, createdAt: user.createdAt });
  });
}

function list(req: Request, res: Response) {
  User.find(function (err: CallbackError, users: HydratedDocument<IUser>) {
    if (err) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        message: "Error when getting user.",
        error: err,
      });
    }

    return res.json(users);
  });
}

function show(req: Request, res: Response) {
  var id = req.params.id;

  User.findOne(
    { _id: id },
    function (err: CallbackError, user: HydratedDocument<IUser>) {
      if (err) {
        return res.status(INTERNAL_SERVER_ERROR).json({
          message: "Error when getting user.",
          error: err,
        });
      }

      if (!user) {
        return res.status(NOT_FOUND).json({
          message: "No such user",
        });
      }

      return res.json(user);
    }
  );
}

function create(req: Request, res: Response) {
  var user = new User({
    email: req.body.email,
    password: req.body.password,
    createdAt: req.body.createdAt,
  });

  user.save(function (err: CallbackError, user) {
    if (err) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        message: "Error when creating user",
        error: err,
      });
    }

    return res.status(CREATED).json(user);
  });
}

function update(req: Request, res: Response) {
  var id = req.params.id;

  User.findOne(
    { _id: id },
    function (err: CallbackError, user: HydratedDocument<IUser>) {
      if (err) {
        return res.status(INTERNAL_SERVER_ERROR).json({
          message: "Error when getting user",
          error: err,
        });
      }

      if (!user) {
        return res.status(NOT_FOUND).json({
          message: "No such user",
        });
      }

      user.email = req.body.email ? req.body.email : user.email;
      user.password = req.body.password ? req.body.password : user.password;
      user.createdAt = req.body.createdAt ? req.body.createdAt : user.createdAt;

      user.save(function (err: CallbackError, user: HydratedDocument<IUser>) {
        if (err) {
          return res.status(INTERNAL_SERVER_ERROR).json({
            message: "Error when updating user.",
            error: err,
          });
        }

        return res.json(user);
      });
    }
  );
}

function remove(req: Request, res: Response) {
  var id = req.params.id;

  User.findByIdAndRemove(
    id,
    function (err: CallbackError, user: HydratedDocument<IUser>) {
      if (err) {
        return res.status(INTERNAL_SERVER_ERROR).json({
          message: "Error when deleting the user.",
          error: err,
        });
      }

      return res.status(NO_CONTENT).json();
    }
  );
}

export default {
  login,
  register,
  list,
  show,
  create,
  update,
  remove,
} as const;
