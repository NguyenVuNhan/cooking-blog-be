import crypto from "crypto";
import bcrypt from "bcrypt-nodejs";

import { IUser } from "../@types/models/user";
import mongoose from "../providers/Database";

// Create the model schema & register your custom methods here
export interface IUserModel extends IUser, mongoose.Document {
  comparePassword(
    password: string,
    cb: (error: Error, result: boolean) => void
  ): string;
  gravatar(_size: number): string;
}

// Define the User Schema
export const UserSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    password: { type: String },
    passwordResetToken: { type: String },
    passwordResetExpires: Date,

    facebook: { type: String },
    google: { type: String },
    tokens: Array,

    fullname: { type: String },
    picture: { type: String },
  },
  {
    timestamps: true,
  }
);

// Password hash middleware
UserSchema.pre<IUserModel>("save", function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next(null);
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, null, (err, _hash) => {
      if (err) {
        return next(err);
      }

      user.password = _hash;
      return next(null);
    });
  });
});

// Compares the user's password with the request password
UserSchema.methods.comparePassword = function (
  requestPassword: string,
  cb: (error: Error, result: boolean) => void
): void {
  bcrypt.compare(requestPassword, this.password, (err, isMatch) => {
    return cb(err, isMatch);
  });
};

// User's gravatar
UserSchema.methods.gravatar = function (size: number): any {
  if (!size) {
    size = 200;
  }

  const url = "https://gravatar.com/avatar";
  if (!this.email) {
    return `${url}/?s=${size}&d=retro`;
  }

  const md5 = crypto.createHash("md5").update(this.email).digest("hex");
  return `${url}/${md5}?s=${size}&d=retro`;
};

const User = mongoose.model<IUserModel>("User", UserSchema);

export default User;
