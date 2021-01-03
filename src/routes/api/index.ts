import { Router } from "express";
import authRoute from "./auth";
import recipeRoute from "./recipe";

const router = Router();

router.use("/recipe", recipeRoute);
router.use("/auth", authRoute);

export default router;
