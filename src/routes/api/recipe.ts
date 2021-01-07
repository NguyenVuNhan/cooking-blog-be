import { Router } from "express";
import passport from "passport";
import AddRecipeController from "../../controllers/api/recipe/AddRecipe";
import DeleteRecipeController from "../../controllers/api/recipe/DeleteRecipe";
import UpdateRecipeController from "../../controllers/api/recipe/UpdateRecipe";
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
 *      post:
 *        summary: Update recipe
 *        description: Update recipe with given id
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
 *          '400':
 *            description: Bad input. Properly missing recipe id
 *          '401':
 *            description: Current user is not the recipe owner
 *          '404':
 *            description: No recipe found
 *      delete:
 *        summary: Delete recipe
 *        description: Delete recipe with id
 *        security:
 *          - BearerAuth: []
 *        parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            description: ID of the recipe to delete
 *        responses:
 *          '200':
 *            description: OK
 *          '400':
 *            description: Bad input. Properly missing recipe id
 *          '401':
 *            description: Current user is not the recipe owner
 *          '404':
 *            description: No recipe found
 */
router.get("/:id", ViewRecipeController.perform);
router.post("/:id", UpdateRecipeController.perform);
router.delete("/:id", DeleteRecipeController.perform);

export default router;
