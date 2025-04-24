import { Router } from "express";
import { loginSchema, registerSchema, updateSchema } from "../../validators/auth.validators.js";
import { validateRequestBody } from "../middlewares/validation.middleware.js";
import * as authController from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.post('/register', validateRequestBody(registerSchema), authController.handleRegister);
router.post('/login', validateRequestBody(loginSchema), authController.handleLogin);
router.post('/logout', requireAuth, authController.handleLogout);

router.get('/me', requireAuth, authController.handleGetMe);
router.patch('/me', validateRequestBody(updateSchema), requireAuth, 
  authController.handleUpdateMe);

export default router;
