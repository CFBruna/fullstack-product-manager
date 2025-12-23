import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface TokenPayload {
    id: number;
    email: string;
    iat: number;
    exp: number;
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                email: string;
            };
        }
    }
}

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new AppError('Token not provided', 401);
    }

    const [, token] = authHeader.split(' ');

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'default_secret_change_me'
        ) as TokenPayload;

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        });

        if (!user) {
            throw new AppError('User not found', 401);
        }

        req.user = {
            id: user.id,
            email: user.email,
        };

        return next();
    } catch (error) {
        throw new AppError('Invalid token', 401);
    }
};
