import { NextFunction, Request, Response } from "express";
import ApplicationError from "../../../exception/ApplicationError";
import Recipe from "../../../models/Recipe";

class ViewRecipe {
  static perform = [
    async (
      req: Request<{ id?: string }>,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const id = req.params.id;

      let recipes = null;
      if (id) {
        recipes = await Recipe.findById(id).exec();
      } else {
        // If id wasn't given, return all recipe of current user
        recipes = await Recipe.find({ user: req.user });
      }

      if (!recipes) {
        return next(new ApplicationError("No recipe found", 404));
      }

      res.status(200).json({
        data: { recipes },
        message: "List recipe",
        success: true,
      });
    },
  ];
}

export default ViewRecipe;
