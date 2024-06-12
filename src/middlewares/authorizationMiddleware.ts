import { NextFunction, Request, Response } from "express";
import { JWTPayload } from "../users/userInterfaces";

export const authorizationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { userId, roles } = req.user as JWTPayload;
    const id = Number(req.params.id);
    let isAdmin = false

    if (roles) { 
        isAdmin = roles.includes("isAdmin") || roles.includes("isSuperUser")
    }

    if (id === userId || isAdmin) {
        next()
    } else {
        res.status(403).json({ error: 'Access denied' });
    }
}