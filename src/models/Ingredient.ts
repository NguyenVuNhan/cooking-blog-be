import mongoose from "../providers/Database";
import { IIngredient } from "../@types/models/ingredient";

// Create the model schema & register your custom methods here
export interface IIngredientModel extends IIngredient, mongoose.Document {}

// Define the Recipe Schema
export const IngredientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String },
  },
  {
    timestamps: true,
  }
);

const Ingredient = mongoose.model<IIngredientModel>(
  "Ingredient",
  IngredientSchema
);

export default Ingredient;
