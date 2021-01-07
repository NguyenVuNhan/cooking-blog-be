import { NextFunction, Request, Response } from "express";
import { param } from "express-validator";
import ApplicationError from "../../../exception/ApplicationError";
import Handler from "../../../exception/Handler";
import Recipe from "../../../models/Recipe";

class DeleteRecipe {
  static perform = [
    param("id", "Recipe id must be given").isString(),
    Handler.validatorHandler,
    async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
      const id = req.params.id;

      const recipe = await Recipe.findById(id);

      // Check if recipe exist
      if (!recipe) {
        return next(new ApplicationError("No recipe found", 404));
      }

      // Check if  current user is the recipe owner
      if (recipe.user.toString() !== req.user.id) {
        return next(
          new ApplicationError(
            "This recipe does not belongs to the current user",
            401
          )
        );
      }

      // Delete recipe
      const deletedRecipe = await recipe.delete();

      return res.status(200).json({
        data: {
          title: deletedRecipe.title,
        },
        message: "Recipe successfully deleted",
        success: true,
      });
    },
  ];
}

export default DeleteRecipe;
