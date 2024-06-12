import { Request, Response } from "express"
import { handleError, handleSuccess } from "../utils/responseHandler";
import { UserService } from "./userService";
import { UserAuthModel } from "./userAuthModel";
import { User } from "./userInterfaces";

export class UserController {
    static async createUser(req: Request, res: Response) {
        try {
            const user = await UserService.createUser(req.body)
            if (!user) {
                return handleError(res, 'User not found', 404);
            }
            handleSuccess(res, 'User fetched successfully', user);
        } catch (error) {
            handleError(res, (error as Error).message);
        }
    }

    static async loginUser(req: Request, res: Response) {
        try {
            const { email, password } = req.body
            const token = await UserService.loginUser(email, password)
            handleSuccess(res, "Login successful", { token })
        } catch (err) {
            handleError(res, (err as Error).message, 401)
        }
    }

    static async getUserById(req: Request, res: Response) {
        try {
            const user = await UserService.getUserById(Number(req.params.id))
            if (!user) {
                return handleError(res, 'User not found', 404);
            }
            handleSuccess(res, 'User fetched successfully', user);
        } catch (err) {
            handleError(res, (err as Error).message, 401)
        }
    }

    static async deleteUserById(req: Request, res: Response) {
        try {
            await UserService.deleteUserById(Number(req.params.id))
            await UserAuthModel.deleteAuthUserById(Number(req.params.id))
            handleSuccess(res, `User deleted successfly`, 200);
        } catch (err) {
            handleError(res, (err as Error).message, 401)
        }
    }

    static async updateUserDetails(req: Request, res: Response) {
        try {
            await UserService.updateUserDetails({ ...req.body, id: req.params.id })
            handleSuccess(res, `User updated successfly`, 200);
        } catch (err) {
            handleError(res, (err as Error).message, 401)
        }
    }

    static async updateUserPassword(req: Request, res: Response) {
        try {
            const newPassword = req.body.password
            await UserService.updateUserPassword(newPassword, Number(req.params.id))
            handleSuccess(res, `password updated successfly`, 200);
        } catch (err) {
            handleError(res, (err as Error).message, 401)
        }
    }
}