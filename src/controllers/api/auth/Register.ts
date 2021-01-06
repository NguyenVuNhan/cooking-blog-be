import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import ApplicationError from "../../../exception/ApplicationError";
import Handler from "../../../exception/Handler";
import User from "../../../models/User";

class Register {
  static perform = [
    body("email")
      .exists()
      .withMessage("Email cannot be empty")
      .bail()
      .isEmail()
      .withMessage("Email is invalid"),
    body("password")
      .exists()
      .withMessage("Password cannot be empty")
      .bail()
      .isLength({ min: 8 })
      .withMessage("Password length must be at least 8 characters"),
    body("cpassword")
      .exists()
      .withMessage("Confirm password cannot be empty")
      .bail()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Password confirmation does not match password");
        }
        return true;
      }),
    Handler.validatorHandler,
    function (req: Request, res: Response, next: NextFunction): void {
      // Get POST data
      const { email, password } = req.body;

      // Check if user exist
      User.findOne({ email }).then((user) => {
        // User exist
        if (user) {
          return next(new ApplicationError("Email already exists"));
        }

        // User not exist
        // Save user to database
        new User({ email, password }).save().then((user) => {
          // Hide sensitive data
          user.password = undefined;
          user.tokens = undefined;

          // Return user
          return res.status(200).json({
            data: user,
            message: "You have been successfully registered",
            success: true,
          });
        });
      });
    },
  ];
}

export default Register;
