import { NextFunction, Request, Response } from "express";
import ApplicationError from "../../../exception/ApplicationError";
import Recipe, { IRecipeModel } from "../../../models/Recipe";

class SearchRecipe {
  static perform = [
    async (
      req: Request<undefined, undefined, undefined, { query: string }>,
      res: Response,
      next: NextFunction
    ) => {
      const query = req.query.query;

      let recipes: IRecipeModel[];
      if (query) {
        recipes = await Recipe.find(
          {
            $text: { $search: query },
          },
          { score: { $meta: "textScore" } }
        )
          .sort("score")
          .populate("ingredients.ingredient")
          .exec();
      } else {
        recipes = await Recipe.find().sort("title").exec();
      }

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

export default SearchRecipe;
