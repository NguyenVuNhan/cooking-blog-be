import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import ApplicationError from "../../../exception/ApplicationError";
import Handler from "../../../exception/Handler";
import User from "../../../models/User";

class Login {
  static perform = [
    body("email")
      .exists()
      .withMessage("Email cannot be empty")
      .bail()
      .isEmail()
      .withMessage("Email is invalid"),
    body("password").exists().withMessage("Password cannot be empty"),
    Handler.validatorHandler,
    function (req: Request, res: Response, next: NextFunction): void {
      // Get POST data
      const { email, password } = req.body;

      // Check if user exist
      User.findOne({ email }).then((user) => {
        // User not exist
        if (!user) {
          return next(
            new ApplicationError(
              `Can not found any user associated with ${email}`
            )
          );
        }

        // If user exist
        user.comparePassword(password, (err, isMatch) => {
          if (err) return next(err);
          if (!isMatch)
            return next(new ApplicationError("Password does not match"));

          const payload = { id: user.id, email, password };

          jwt.sign(
            payload,
            req.app.locals.appSecret,
            { expiresIn: req.app.locals.jwtExpiresIn * 60 },
            (err, token) => {
              if (err) return next(err);

              // Hide sensitive data
              user.password = undefined;
              user.tokens = undefined;

              res.status(200).json({
                data: { user, token: "Bearer " + token },
                message: "You have been successfully logged in",
                success: true,
              });
            }
          );
        });
      });
    },
  ];
}

export default Login;
