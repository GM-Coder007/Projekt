import {
  Schema,
  model,
  Date,
  CallbackError,
  HydratedDocument,
  Model,
} from "mongoose";
import bcrypt from "bcrypt";

export interface IUser {
  email: string;
  password: string;
  twofa: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface UserModel extends Model<IUser> {
  authenticate(
    email: string,
    password: string,
    callback: (err?: CallbackError, user?: HydratedDocument<IUser>) => void
  ): void;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    twofa: { type: Boolean, default: false, required: true },
  },
  { timestamps: true }
);

userSchema.static(
  "authenticate",
  function authenticate(
    email: string,
    password: string,
    callback: (err?: CallbackError, user?: HydratedDocument<IUser>) => void
  ) {
    this.findOne({ email }).exec(function (
      err: CallbackError,
      user: HydratedDocument<IUser>
    ) {
      if (err) return callback(err);
      else if (!user) return callback();

      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) return callback(null, user);
        else return callback();
      });
    });
  }
);

/*userSchema.statics.authenticate = function (
  username: string,
  password: string,
  callback: (
    err: CallbackError | null,
    user: HydratedDocument<IUser> | null
  ) => void
) {
  this.findOne({ username: username }).exec(function (
    err: CallbackError,
    user: HydratedDocument<IUser>
  ) {
    if (err) return callback(err, null);
    else if (!user) return callback(null, null);

    bcrypt.compare(password, user.password, function (err, result) {
      if (result === true) return callback(null, user);
      else return callback(null, null);
    });
  });
};*/

/*userSchema.pre("save", function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});*/

const User = model<IUser, UserModel>("User", userSchema);

/*
var Schema = mongoose.Schema;

var userSchema = new Schema({
  email: String,
  password: String,
  createdAt: Date,
});

module.exports = mongoose.model("user", userSchema);
*/
export default User;
