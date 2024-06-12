import pool from "../config/db"
import bcrypt from 'bcrypt'
import { User, UserAuth } from "./userInterfaces";

export class UserAuthModel {
    static async create(userId: number, hashedPassword: string): Promise<UserAuthModel> {
        const query = 'INSERT INTO users_auth (user_id, password_hash, last_login) VALUES ($1, $2, $3) RETURNING *'
        const values = [userId, hashedPassword, new Date()];
        const { rows } = await pool.query(query, values);
        return rows[0]    
    }

    static async findByEmail(email: string):Promise<Partial<UserAuth> & Partial <User> | null> {
        const query = `
        SELECT ua.user_id, ua.password_hash, u.roles
        FROM users_auth ua
        JOIN users u ON ua.user_id = u.id
        where u.email = $1`
        const { rows } = await pool.query(query, [email])
        return rows[0] || null
    }

    static async verifyPassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash)
    }

    static async updateLastLogin(userId: number): Promise<void> {
        const query = `UPDATE users_auth SET last_login = CURRENT_TIMESTAMP WHERE user_id = $1`
        await pool.query(query, [userId])
    }
    
    static async deleteAuthUserById(userId: number): Promise<void> {
        const query = `DELETE FROM users_auth WHERE user_id = $1`
        await pool.query(query, [userId])
    }

    static async updatePassword(newPassword: string, userId: number): Promise<void> {
        const query = `UPDATE users_auth SET password_hash = $1 WHERE user_id = $2`
        await pool.query(query, [newPassword, userId])
    }
}