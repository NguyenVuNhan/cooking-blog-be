import { NextFunction, Request, Response } from "express";
import ApplicationError from "../../../exception/ApplicationError";
import Recipe from "../../../models/Recipe";

class ViewRecipe {
  static perform = [
    async (
      req: Request<{ id?: string }>,
      res: Response,
      next: NextFunction
    ) => {
      const id = req.params.id;

      let recipes = null;
      recipes = await Recipe.findById(id)
        .populate({
          path: "ingredients",
          populate: {
            path: "ingredient",
            select: "name",
          },
        })
        .exec();

      if (!recipes) {
        return next(new ApplicationError("No recipe found", 404));
      }

      return res.status(200).json({
        data: { recipes },
        message: "List recipe",
        success: true,
      });
    },
  ];
}

export default ViewRecipe;
