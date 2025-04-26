import { Router } from "express";
// import { userSchema } from "../../validators/user.validators.js";
import { validateRequestBody } from "../middlewares/validation.middleware.js";
import * as userController from "../controllers/user.controller.js";
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get('/', requireAuth, requireAdmin, userController.handleGetUsers);
router.delete('/:id', requireAuth, requireAdmin, userController.handleDeleteUser);
// router.patch('/:id', validateRequestBody(updateUserSchema), requireAuth, requireAdmin,
  // userController.handleUpdateUser);


export default router;
