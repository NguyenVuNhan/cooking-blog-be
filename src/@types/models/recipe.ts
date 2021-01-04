import { IIngredient } from "./ingredient";
import IUser from "./user";

type IIngredientList = { ingredients: IIngredient; quantity: number }[];

export interface IStep {
  description: string;
  duration?: string;
  ingredients: IIngredientList;
}

export interface IRecipe {
  title: string;
  user: IUser;
  course: string;
  ingredients: IIngredientList;
  duration: number;
  steps: IStep[];
}
