import mongoose from "../providers/Database";
import { IRecipe } from "../@types/models/recipe";

const ObjectId = mongoose.Types.ObjectId;

// Create the model schema & register your custom methods here
export interface IRecipeModel extends IRecipe, mongoose.Document {}

// Define the Recipe Schema
export const RecipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    user: { type: ObjectId, ref: "User", required: true },
    course: { type: String },
    ingredients: [
      {
        ingredient: { type: ObjectId, ref: "Ingredient" },
        quantity: { type: String },
      },
    ],
    ingredientsStr: { type: String },
    duration: { type: String, required: true },
    steps: [
      {
        description: { type: String, required: true },
        duration: { type: String },
        ingredients: [String],
      },
    ],
  },
  {
    timestamps: true,
  }
);

RecipeSchema.index(
  {
    title: "text",
    "steps.description": "text",
    ingredientsStr: "text",
  },
  {
    title: 10,
    "steps.description": 2,
    ingredientsStr: 5,
  }
);

const Recipe = mongoose.model<IRecipeModel>("Recipe", RecipeSchema);

export default Recipe;
