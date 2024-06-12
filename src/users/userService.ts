import pool from "../config/db";
import { generateToken } from "../utils/jwt";
import { UserAuthModel } from "./userAuthModel";
import { Role, User } from "./userInterfaces";

import { UserModel } from "./userModel";
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10

export class UserService {
    static async createUser(data: User & { password: string }): Promise<User> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const user = await UserModel.create(data)

            const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS)
            await UserAuthModel.create(user.id as number, passwordHash);
            await client.query('COMMIT');

            return user
        } catch (error) {
            await client.query("ROLLBACK")
            throw error
        } finally {
            client.release()
        }

    }

    static async loginUser(email: string, password: string): Promise<string> {
        try {
            const authUser = await UserAuthModel.findByEmail(email)
            if (!authUser) {
                throw new Error('User not found');
            }

            const isPasswordValid = await UserAuthModel.verifyPassword(password, authUser.password_hash as string);
            if (!isPasswordValid) {
                throw new Error('Invalid login details');
            }
            const token = generateToken({ userId: authUser.user_id as number, roles: authUser.roles as Role[]})
            await UserAuthModel.updateLastLogin(authUser.user_id as number)
            return token
        } catch (err) {
            throw err
        }
    }

    static async getUserById(id: number): Promise<User | null> {
        return await UserModel.findById(id);
    }

    static async deleteUserById(id: number): Promise<void> {
        try {
            await UserAuthModel.deleteAuthUserById(id)
            await UserModel.deleteUserById(id)
            return
        } catch (err) {
            throw err
        }
    }

    static async updateUserDetails(user: User): Promise<void> {
        try {
            await UserModel.updateUser(user)
        } catch (err) {
            throw err
        }
    }

    static async updateUserPassword(newPassword: string, userId: number) {
        try {
            const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS)
            await UserAuthModel.updatePassword(passwordHash, userId)
        } catch (err) {
            throw err
        }
    }
}