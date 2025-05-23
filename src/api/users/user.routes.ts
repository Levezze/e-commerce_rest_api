import { Router, type Router as ExpressRouter } from "express";
// import { userSchema } from "../../validators/user.validators.js";
import { validateRequestBody } from "../../middlewares/validation.middleware.js";
import * as userController from "./user.controller.js";
import { requireAuth, requireAdmin } from "../../middlewares/auth.middleware.js";

const router: ExpressRouter = Router();

router.get('/', requireAuth, requireAdmin, userController.handleGetUsers);
router.get('/:id', requireAuth, requireAdmin, userController.handleGetUserById);
router.delete('/:id', requireAuth, requireAdmin, userController.handleDeleteUser);
// router.patch('/:id', validateRequestBody(updateUserSchema), requireAuth, requireAdmin,
//   userController.handleUpdateUser);


export default router;
