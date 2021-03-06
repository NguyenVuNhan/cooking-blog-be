import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { IIngredientElem, IRecipe } from "../../../@types/models/recipe";
import ApplicationError from "../../../exception/ApplicationError";
import Handler from "../../../exception/Handler";
import Ingredient from "../../../models/Ingredient";
import Recipe from "../../../models/Recipe";

class AddRecipe {
  static perform = [
    body("title", "Recipe title cannot be empty").isString(),
    body("ingredients", "At least one ingredient must be given").isArray({
      min: 1,
    }),
    body("duration", "Duration cannot be empty").isString(),
    body("steps", "At least one steps must be given").isArray({ min: 1 }),
    Handler.validatorHandler,
    async function (
      req: Request<{}, {}, IRecipe>,
      res: Response,
      next: NextFunction
    ): Promise<void> {
      const recipe = await Recipe.findOne({ title: req.body.title });

      // Recipe with this name already exists
      if (recipe) {
        return next(
          new ApplicationError(
            `Recipe with name "${recipe.title}" already exist`
          )
        );
      }

      const ingredientPromises: Promise<IIngredientElem>[] = req.body.ingredients.map(
        async (val) => {
          const name = val.ingredient.toLowerCase();
          const quantity = val.quantity;

          const ingredient = await Ingredient.findOne({ name });
          return await (ingredient
            ? { ingredient: ingredient.id, quantity }
            : new Ingredient({ name }).save().then((newIngredient) => ({
                ingredient: newIngredient.id,
                quantity,
              })));
        }
      );

      // Run all ingredientPromises
      req.body.ingredients = await Promise.all(ingredientPromises);

      // Add new recipe
      const newRecipe = await new Recipe({
        ...req.body,
        user: req.user.id,
      }).save();

      res.status(200).json({
        data: { id: newRecipe.id, title: newRecipe.title },
        message: "New recipe added",
        success: true,
      });
    },
  ];
}

export default AddRecipe;
