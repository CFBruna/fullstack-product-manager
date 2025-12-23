import { Request, Response, NextFunction } from 'express';
import { authMiddleware } from './authMiddleware';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/AppError';

// Mock dependencies
jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        user: {
            findUnique: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

jest.mock('jsonwebtoken');

describe('AuthMiddleware', () => {
    let mockPrisma: any;
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: jest.Mock;

    beforeEach(() => {
        mockPrisma = new PrismaClient();
        req = {
            headers: {},
        };
        res = {};
        next = jest.fn();
        jest.clearAllMocks();
    });

    it('should call next if token is valid', async () => {
        req.headers = { authorization: 'Bearer valid-token' };
        const decodedToken = { id: 1, email: 'test@example.com' };
        const mockUser = { id: 1, email: 'test@example.com' };

        (jwt.verify as jest.Mock).mockReturnValue(decodedToken);
        mockPrisma.user.findUnique.mockResolvedValue(mockUser);

        await authMiddleware(req as Request, res as Response, next);

        expect(jwt.verify).toHaveBeenCalled();
        expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
        expect(req.user).toEqual(mockUser);
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(); // Called without error
    });

    it('should throw 401 if token is missing', async () => {
        req.headers = {};

        await expect(authMiddleware(req as Request, res as Response, next))
            .rejects
            .toEqual(expect.objectContaining({ statusCode: 401, message: 'Token not provided' }));

        expect(next).not.toHaveBeenCalled();
    });

    it('should throw 401 if token is invalid', async () => {
        req.headers = { authorization: 'Bearer invalid-token' };

        (jwt.verify as jest.Mock).mockImplementation(() => {
            throw new Error('Invalid token');
        });

        await expect(authMiddleware(req as Request, res as Response, next))
            .rejects
            .toEqual(expect.objectContaining({ statusCode: 401, message: 'Invalid token' }));
    });

    it('should throw 401 if user not found', async () => {
        req.headers = { authorization: 'Bearer valid-token' };
        // decoded token valid, but user deleted from DB
        (jwt.verify as jest.Mock).mockReturnValue({ id: 999 });
        mockPrisma.user.findUnique.mockResolvedValue(null);

        await expect(authMiddleware(req as Request, res as Response, next))
            .rejects
            .toEqual(expect.objectContaining({ statusCode: 401 }));
    });
});
