import { NextFunction, Request, Response } from "express";
import { body, param } from "express-validator";
import { IIngredientElem, IRecipe } from "../../../@types/models/recipe";
import ApplicationError from "../../../exception/ApplicationError";
import Handler from "../../../exception/Handler";
import Ingredient from "../../../models/Ingredient";
import Recipe from "../../../models/Recipe";

class UpdateRecipe {
  static perform = [
    param("id", "Recipe id must be given").isString(),
    body("ingredients", "Invalid input").optional().isArray({ min: 1 }),
    body("steps", "Invalid input").optional().isArray({ min: 1 }),
    Handler.validatorHandler,
    async (
      req: Request<{ id: string }, {}, IRecipe>,
      res: Response,
      next: NextFunction
    ) => {
      const id = req.params.id;

      // If new title was given, check whether it exist or not
      if (req.body.title) {
        const recipe = await Recipe.findOne({ title: req.body.title });

        // Recipe with this name already exists
        if (recipe) {
          return next(
            new ApplicationError(
              `Recipe with name "${recipe.title}" already exist`
            )
          );
        }
      }

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

      // If new ingredients was given
      if (req.body.ingredients) {
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
      }

      const newRecipe = { ...req.body };

      if (Object.keys(newRecipe).length === 0) {
        return res.status(200).json({
          data: {
            title: recipe.title,
          },
          message: "There is nothing to update",
          success: true,
        });
      }

      await recipe.updateOne(
        { $set: newRecipe },
        { new: true, useFindAndModify: false }
      );

      return res.status(200).json({
        data: {
          id: recipe.id,
          title: newRecipe.title || recipe.title,
        },
        message: "Recipe successfully updated",
        success: true,
      });
    },
  ];
}

export default UpdateRecipe;
