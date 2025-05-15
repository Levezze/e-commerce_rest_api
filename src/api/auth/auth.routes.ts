import { Router, type Router as ExpressRouter } from "express";
// import { loginSchema, registerSchema, updateMeSchema } from "../validators/auth.validators.js";
import { validateRequestBody } from "../../middlewares/validation.middleware.js";
import * as authController from "./auth.controller.js";
import { requireAuth } from "./auth.middleware.js";
import { z } from "zod";
import { schemas } from "../../dtos/custom/zod.js";

type UserSelfResponse = z.infer<typeof schemas.UserSelf>;
type UserAdminResponse = z.infer<typeof schemas.UserAdmin>;
type UserTokenResponse = z.infer<typeof schemas.UserWithToken>;
type UserRegisterInput = z.infer<typeof schemas.RegisterUser>;
type UserUpdateMe = z.infer<typeof schemas.UpdateMe>;

const router: ExpressRouter = Router();

router.post('/register', validateRequestBody(schemas.RegisterUser), authController.handleRegister);
router.post('/login', validateRequestBody(schemas.LoginRequest), authController.handleLogin);
router.post('/logout', requireAuth, authController.handleLogout);

router.get('/me', requireAuth, authController.handleGetMe);
router.patch('/me', validateRequestBody(schemas.UpdateMe), requireAuth, authController.handleUpdateMe);

export default router;