import { Request, Response } from "express";
import Ingredient from "../../../models/Ingredient";

class GetIngredients {
  static perform = [
    async (req: Request<{ name: string }>, res: Response) => {
      const name = req.params.name;

      let ingredients = (
        await Ingredient.find({
          // $text: { $search: name },
          name: { $regex: `^${name}` },
        })
          .select("name -_id")
          .sort("name")
          .exec()
      ).map(({ name }) => name);

      return res.status(200).json({
        data: { ingredients },
        message: "Get ingredients",
        success: true,
      });
    },
  ];
}

export default GetIngredients;
