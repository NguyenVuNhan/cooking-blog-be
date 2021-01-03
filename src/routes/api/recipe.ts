import { Router } from "express";
import passport from "passport";
import AddRecipe from "../../controllers/api/recipe/AddRecipe";

const router = Router();

router.use(passport.authenticate("jwt", { session: false }));

router.get("/add", AddRecipe.perform);

export default router;
