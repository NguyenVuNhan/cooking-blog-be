import { IUser } from "./user";

export interface IIngredientElem {
  ingredient: string;
  quantity: string;
}
export type IIngredientList = IIngredientElem[];

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
