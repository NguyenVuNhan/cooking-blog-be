import { Router } from "express";
import passport from "passport";
import AddRecipeController from "../../controllers/api/recipe/AddRecipe";
import ViewRecipeController from "../../controllers/api/recipe/ViewRecipe";

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
 *      get:
 *        summary: Get all recipes
 *        description: Get all recipes of current user
 *        security:
 *          - BearerAuth: []
 *        responses:
 *          '200':
 *            description: OK
 *          '404':
 *            description: No recipe found
 */
router.post("/", AddRecipeController.perform);
router.get("/", ViewRecipeController.perform);

/**
 * @swagger
 * paths:
 *   /api/recipe/{id}:
 *      get:
 *        summary: Get recipe
 *        description: Get recipe by id
 *        security:
 *          - BearerAuth: []
 *        parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            description: ID of the recipe to get
 *        responses:
 *          '200':
 *            description: OK
 *          '404':
 *            description: No recipe found
 */
router.get("/:id", ViewRecipeController.perform);

export default router;
