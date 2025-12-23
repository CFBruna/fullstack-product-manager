import { Request, Response, NextFunction } from 'express';
import { errorHandler } from './errorHandler';
import { AppError } from '../utils/AppError';
import { ZodError } from 'zod';

describe('ErrorHandler Middleware', () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockReq = {};
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        mockNext = jest.fn();
        jest.spyOn(console, 'error').mockImplementation(() => { }); // Silence console.error
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should handle AppError correctly', () => {
        const error = new AppError('Custom Error', 418);

        errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(418);
        expect(mockRes.json).toHaveBeenCalledWith({
            status: 'error',
            message: 'Custom Error',
        });
    });

    it('should handle ZodError correctly', () => {
        const zodError = new ZodError([{
            code: 'invalid_type',
            expected: 'string',
            received: 'number',
            path: ['name'],
            message: 'Expected string, received number'
        }]);

        errorHandler(zodError, mockReq as Request, mockRes as Response, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            status: 'error',
            message: 'Validation error',
            errors: zodError.errors,
        });
    });

    it('should handle generic Error as 500', () => {
        const error = new Error('Unexpected crash');

        errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({
            status: 'error',
            message: 'Internal Server Error',
        });
    });
});
