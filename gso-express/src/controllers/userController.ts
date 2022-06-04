import { Request, Response } from "express";
import StatusCodes from "http-status-codes";
import User from "../models/userModel";
import { validationResult } from "express-validator";
import { sign } from "jsonwebtoken";
import { IUser } from "../models/userModel";

const {
  OK,
  CREATED,
  NO_CONTENT,
  NOT_FOUND,
  UNAUTHORIZED,
  CONFLICT,
  INTERNAL_SERVER_ERROR,
} = StatusCodes;

function profile(req: Request, res: Response) {
  if (req.user) {
    const user = req.user;

    return res.json({
      _id: user._id,
      email: user.email,
      twofa: user.twofa,
      createdAt: user.createdAt,
    });
  }
  return res.status(UNAUTHORIZED).json({ msg: "No user found" });
}

async function login(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ msg: "Bad input info", errors: errors.array() });
  }

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
      if (req.query.type === "jwt") {
        const secret = process.env.ACCESS_TOKEN_SECRET;
        const expire = process.env.ACCESS_TOKEN_EXPIRE || "30d";
        if (secret == null)
          return res
            .status(INTERNAL_SERVER_ERROR)
            .json({ msg: "No configured secret" });
        const token = sign({ sub: user._id }, secret, {
          expiresIn: expire,
        });
        return res.json({ token });
      } else {
        req.session.userId = user._id.toString();
      }

      return res.json({
        _id: user._id,
        email: user.email,
        createdAt: user.createdAt,
      });
    }
  });
}

async function register(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ msg: "Bad input info", errors: errors.array() });
  }

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

async function edit(req: Request, res: Response) {
  if (req.user) {
    if (req.body.twofa === true) req.user.twofa = req.body.twofa;
    else if (req.body.twofa === false) req.user.twofa = req.body.twofa;
    try {
      await req.user.save();
      return res.json({
        _id: req.user._id,
        email: req.user.email,
        twofa: req.user.twofa,
        createdAt: req.user.createdAt,
      });
    } catch (err) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        msg: "Server error.",
      });
    }
  }
  return res.status(UNAUTHORIZED).json({ msg: "No user found" });
}

/*function list(req: Request, res: Response) {
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
*/

export default {
  profile,
  login,
  register,
  edit,
} as const;
