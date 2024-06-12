import pool from "../config/db"
import { User } from "./userInterfaces";


export class UserModel {
    static async create(user: User): Promise<User> {
        const user_create_query = 'INSERT INTO users (first_name, last_name, email, create_date, update_date) VALUES ($1, $2, $3, $4, $5) RETURNING *'
        const values = [user.first_name, user.last_name, user.email, new Date(), new Date()];
        const { rows } = await pool.query(user_create_query, values);
        return rows[0]    
    }

    static async findById(userId: number): Promise<User> {
        const user_find_query = 'SELECT * FROM users WHERE id = $1'
        const values = [userId];
        const { rows } = await pool.query(user_find_query, values);
        return rows[0]    
    }

    static async deleteUserById(userId: number): Promise<void> {
        const user_delete_query = `DELETE FROM users WHERE id = $1`
        await pool.query(user_delete_query, [userId])
    }

    static async updateUser(user: User): Promise<User> {
        const user_update_query = `
        UPDATE users
        SET first_name = COALESCE($1, first_name),
            last_name = COALESCE($2, last_name),
            roles = COALESCE($3, roles),
            update_date = $4
        WHERE id = $5
        RETURNING *; 
        `
        const values = [user.first_name, user.last_name, user.roles ,new Date(), user.id];
        const { rows } = await pool.query(user_update_query, values);
        return rows[0]  
    }
}