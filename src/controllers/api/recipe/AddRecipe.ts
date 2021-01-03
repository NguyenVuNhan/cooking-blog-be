import { validationResult } from "express-validator";
import { IReq, IRes } from "../../../@types/vendors";

class AddRecipe {
  static perform(req: IReq, res: IRes) {
    try {
      // Validation
      validationResult(req).throw();

      res.status(200).json({
        data: {},
        message: "Can not found any user with this email",
        success: false,
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

export default AddRecipe;
