import { Router } from "express";
import { UserController } from "./userController";
import { userCreateValidationRules, userDetailsUpdateValidationRules } from "./userValidiation";
import { passwordValidator, wrapValidationMiddleware } from "../utils/validationUtils";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizationMiddleware } from "../middlewares/authorizationMiddleware";

export const userRouter = Router()
userRouter.post('/', wrapValidationMiddleware(userCreateValidationRules), UserController.createUser)
userRouter.post('/login', UserController.loginUser);
userRouter.put(
    '/updateDetails/:id',
    authMiddleware,
    authorizationMiddleware,
    wrapValidationMiddleware(userDetailsUpdateValidationRules),
    UserController.updateUserDetails
);
userRouter.put(
    '/updatePassword/:id',
    authMiddleware,
    authorizationMiddleware,
    wrapValidationMiddleware([passwordValidator()]),
    UserController.updateUserPassword
);
userRouter.delete('/:id', authMiddleware, authorizationMiddleware, UserController.deleteUserById);
userRouter.get('/:id', authMiddleware, UserController.getUserById);