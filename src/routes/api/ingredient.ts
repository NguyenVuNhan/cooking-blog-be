import { Router } from "express";
import GetIngredients from "../../controllers/api/ingredient/GetIngredients";

const router = Router();

router.get("/:name", GetIngredients.perform);

export default router;
