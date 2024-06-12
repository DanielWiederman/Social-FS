export interface UserAuth {
    auth_id?: number
    user_id?: number
    password_hash: string
    last_login: Date
}

export interface User {
    id?: number
    first_name: string
    last_name: string
    email: string
    create_date: Date
    update_date: Date
    roles?: Role[]
}

export interface JWTPayload {
    userId: number
    roles: Role[]
}

export type Role = 'isAdmin' | 'isSuperUser';