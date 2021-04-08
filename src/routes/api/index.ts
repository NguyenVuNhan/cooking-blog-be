import { Router } from "express";
import authRoute from "./auth";
import recipeRoute from "./recipe";
import ingredientRoute from "./ingredient";

const router = Router();

router.use("/recipe", recipeRoute);
router.use("/auth", authRoute);
router.use("/ingredients", ingredientRoute);

export default router;
