import { Router } from "express";
import { loginSchema, registerSchema } from "../../validators/auth.validators.js";
import { validateRequestBody } from "../middlewares/validation.middleware.js";
import * as authController from "../controllers/auth.controller.js";

const router = Router();

router.post('/register', validateRequestBody(registerSchema), authController.handleRegister);
router.post('/login', validateRequestBody(loginSchema), authController.handleLogin);

export default router;
