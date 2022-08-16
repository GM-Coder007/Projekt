import { Request, Response } from "express";
import StatusCodes from "http-status-codes";
import User from "../models/userModel";
import { validationResult } from "express-validator";
import { sign } from "jsonwebtoken";
import bcrypt from "bcrypt";

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
      updatedAt: user.updatedAt,
    });
  }
  return res.status(UNAUTHORIZED).json({ msg: "No user found" });
}

function logout(req: Request, res: Response) {
  //res.clearCookie("token");
  res.cookie("token", "logged out", {
    httpOnly: true,
    maxAge: 1000,
    domain: process.env.COOKIE_DOMAIN || "localhost",
    sameSite: "strict",
  });
  return res.json({ msg: "Logged out" });
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

  let twofa = false;
  if (req.query.react === "true" || req.query.react === "1") twofa = true;

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
      const secret = process.env.ACCESS_TOKEN_SECRET;
      const expireString = process.env.ACCESS_TOKEN_EXPIRE || "2592000";
      const expire = parseInt(expireString);
      if (secret == null)
        return res
          .status(INTERNAL_SERVER_ERROR)
          .json({ msg: "No configured secret" });
      const token = sign({ sub: user._id, twofa }, secret, {
        expiresIn: expire,
      });
      if (req.query.setCookie === "true" || req.query.setCookie === "1") {
        res.cookie("token", token, {
          httpOnly: true,
          maxAge: expire * 1000,
          domain: process.env.COOKIE_DOMAIN || "localhost",
          sameSite: "strict",
        });
      }
      return res.json({ token, twofa: user.twofa });
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
  let password: string = req.body.password;

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

  try {
    password = await bcrypt.hash(password, 10);
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
    return res.status(CREATED).json({
      _id: user._id,
      email: user.email,
      twofa: user.twofa,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  });
}

async function edit(req: Request, res: Response) {
  if (req.user) {
    if (req.body.twofa === true) req.user.twofa = req.body.twofa;
    else if (req.body.twofa === false) req.user.twofa = req.body.twofa;

    if (req.body.password) {
      try {
        const password = req.body.password;
        const hash = await bcrypt.hash(password, 10);
        req.user.password = hash;
      } catch (err) {
        return res.status(INTERNAL_SERVER_ERROR).json({
          msg: "Server error.",
        });
      }
    }

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
  logout,
  login,
  register,
  edit,
} as const;
