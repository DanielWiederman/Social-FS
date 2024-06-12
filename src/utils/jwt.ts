import jwt from 'jsonwebtoken'
import { JWTPayload } from '../users/userInterfaces'

const EXPIRE_TIME = "24h"
const secret = process.env.JWT_SECRET || 'your-secret-key'

export const generateToken = (payload: JWTPayload): string => {
    return jwt.sign(payload, secret, {expiresIn: EXPIRE_TIME})
}

export const verifyToken = (token: string): any => {
    try {
        return jwt.verify(token, secret)
    } catch (err) {
        return null
    }
}