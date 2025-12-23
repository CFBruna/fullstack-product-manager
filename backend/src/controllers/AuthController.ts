import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';
import { z } from 'zod';

const prisma = new PrismaClient();

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
});

export class AuthController {
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, email, password } = registerSchema.parse(req.body);

            const existingUser = await prisma.user.findUnique({
                where: { email },
            });

            if (existingUser) {
                throw new AppError('User already exists', 400);
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                },
            });

            const { password: _, ...userWithoutPassword } = user;

            res.status(201).json(userWithoutPassword);
        } catch (error) {
            next(error);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = loginSchema.parse(req.body);

            const user = await prisma.user.findUnique({
                where: { email },
            });

            if (!user) {
                throw new AppError('Invalid email or password', 401);
            }

            const isValidPassword = await bcrypt.compare(password, user.password);

            if (!isValidPassword) {
                throw new AppError('Invalid email or password', 401);
            }

            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET || 'default_secret_change_me',
                { expiresIn: '1d' }
            );

            const { password: _, ...userWithoutPassword } = user;

            res.status(200).json({
                user: userWithoutPassword,
                token,
            });
        } catch (error) {
            next(error);
        }
    }
}
