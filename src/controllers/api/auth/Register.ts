import { body, validationResult } from "express-validator";
import { IReq, IRes } from "../../../@types/vendors";
import User from "../../../models/User";

class Register {
  static validators = [
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
  ];

  static perform(req: IReq, res: IRes) {
    try {
      // Validation
      validationResult(req).throw();

      // Get POST data
      const { email, password } = req.body;

      // Check if user exist
      User.findOne({ email }).then((user) => {
        // User exist
        if (user) {
          return res.status(400).json({
            data: { email },
            message: "Email already exists",
            success: false,
          });
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
    } catch (err) {
      res.status(400).json({
        data: { ...err },
        message: "Error",
        success: false,
      });
    }
  }
}

export default Register;
