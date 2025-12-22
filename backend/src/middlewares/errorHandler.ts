import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { ZodError } from 'zod';

export function errorHandler(
    error: Error,
    request: Request,
    response: Response,
    next: NextFunction
): void {
    if (error instanceof AppError) {
        response.status(error.statusCode).json({
            status: 'error',
            message: error.message,
        });
        return;
    }

    if (error instanceof ZodError) {
        response.status(400).json({
            status: 'error',
            message: 'Validation error',
            errors: error.errors,
        });
        return;
    }

    // eslint-disable-next-line no-console
    console.error(error);

    response.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
    });
}
