import { Request, Response } from 'express';
import { AuthController } from './AuthController';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';

// Mock dependencies
jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        user: {
            findUnique: jest.fn(),
            create: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('AuthController', () => {
    let authController: AuthController;
    let mockPrisma: any;
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: jest.Mock;

    beforeEach(() => {
        authController = new AuthController();
        mockPrisma = new PrismaClient();
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    describe('register', () => {
        const mockUser = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedPassword',
        };

        it('should register a new user successfully', async () => {
            req.body = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
            };

            // Mock prisma findUnique (user does not exist)
            mockPrisma.user.findUnique.mockResolvedValue(null);
            // Mock bcrypt hash
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
            // Mock prisma create
            mockPrisma.user.create.mockResolvedValue({ ...mockUser, id: 1 });

            await authController.register(req as Request, res as Response, next);

            expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { email: mockUser.email } });
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(mockPrisma.user.create).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: mockUser.name,
                    email: mockUser.email,
                })
            );
        });

        it('should fail if email is already in use', async () => {
            req.body = {
                name: 'Test User',
                email: 'exists@example.com',
                password: 'password123',
            };

            mockPrisma.user.findUnique.mockResolvedValue({ id: 1, email: 'exists@example.com' });

            await authController.register(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(expect.any(AppError));
            expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400, message: 'User already exists' }));
        });
    });

    describe('login', () => {
        const mockUser = {
            id: 1,
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedPassword',
        };

        it('should login successfully and return token', async () => {
            req.body = {
                email: 'test@example.com',
                password: 'password123',
            };

            mockPrisma.user.findUnique.mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (jwt.sign as jest.Mock).mockReturnValue('fake-jwt-token');

            await authController.login(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                user: expect.objectContaining({ email: mockUser.email }),
                token: 'fake-jwt-token',
            });
        });

        it('should fail if user not found', async () => {
            req.body = {
                email: 'notfound@example.com',
                password: 'password123',
            };

            mockPrisma.user.findUnique.mockResolvedValue(null);

            await authController.login(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(expect.any(AppError));
            expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
        });

        it('should fail if password is incorrect', async () => {
            req.body = {
                email: 'test@example.com',
                password: 'wrongpassword',
            };

            mockPrisma.user.findUnique.mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await authController.login(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(expect.any(AppError));
            expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
        });
    });
});
