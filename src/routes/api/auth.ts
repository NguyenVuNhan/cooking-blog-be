import { Router } from "express";
import LoginController from "../../controllers/api/auth/Login";
import RefreshTokenController from "../../controllers/api/auth/RefreshToken";
import RegisterController from "../../controllers/api/auth/Register";

const router = Router();

// Authentication
router.post("/login", LoginController.validators, LoginController.perform);
router.post(
  "/register",
  RegisterController.validators,
  RegisterController.perform
);
router.get("/refresh", RefreshTokenController.perform);

export default router;
