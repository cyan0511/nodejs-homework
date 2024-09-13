import { HttpError } from '../errors/HttpError.js';

export const errorHandler = (err, req, res, next) => {
    if (err instanceof HttpError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }

    console.error(err.stack); // Log the error stack for debugging
    res.status(500).json({
        status: 'error',
        message: 'An unexpected error occurred',
    });
};
