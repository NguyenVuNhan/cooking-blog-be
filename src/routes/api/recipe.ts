import { Router } from "express";
import passport from "passport";
import AddRecipeController from "../../controllers/api/recipe/AddRecipe";

const router = Router();

router.use(passport.authenticate("jwt", { session: false }));

/**
 * @swagger
 * paths:
 *   /api/recipe:
 *      post:
 *        summary: Add recipe
 *        description: User add new recipe
 *        security:
 *          - BearerAuth: []
 *        responses:
 *          '200':
 *            description: OK
 *          '400':
 *            description: Some thing wrong with post data
 */
router.post("/", AddRecipeController.validator, AddRecipeController.perform);

export default router;
