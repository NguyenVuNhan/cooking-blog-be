import { body, validationResult } from "express-validator";
import { IReq, IRes } from "../../../@types/vendors";
import jwt from "jsonwebtoken";
import User from "../../../models/User";

class Login {
  static validators = [
    body("email")
      .exists()
      .withMessage("Email cannot be empty")
      .bail()
      .isEmail()
      .withMessage("Email is invalid"),
    body("password").exists().withMessage("Password cannot be empty"),
  ];

  static perform(req: IReq, res: IRes): void {
    try {
      // Validation
      validationResult(req).throw();

      // Get POST data
      const { email, password } = req.body;

      // Check if user exist
      User.findOne({ email }).then((user) => {
        // User not exist
        if (!user) {
          return res.status(400).json({
            data: { email },
            message: "Can not found any user with this email",
            success: false,
          });
        }

        // If user exist
        user.comparePassword(password, (err, isMatch) => {
          if (err) throw err;
          if (!isMatch) throw Error("Password does not match");

          const payload = { id: user.id, email, password };

          jwt.sign(
            payload,
            req.app.locals.appSecret,
            {
              expiresIn: req.app.locals.jwtExpiresIn * 60,
            },
            (err, token) => {
              if (err) throw err;

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
    } catch (err) {
      res.status(400).json({
        data: { ...err },
        message: "Error",
        success: false,
      });
    }
  }
}

export default Login;
