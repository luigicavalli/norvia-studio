import * as Sentry                              from '@sentry/node';
import { AppError }                             from "../application/error/AppError.js";
import type { NextFunction, Request, Response } from "express";


type HttpError = Error & {
    statusCode?: number | undefined;
    code?:       string | undefined;
};

const resolveStatus = (error: HttpError): number => {

    if (error instanceof AppError) {
        return error.statusCode;
    }

    const status = Number(error.statusCode);

    if (Number.isInteger(status) && status >= 400 && status < 600) {
        return status;
    }

    return 500;

};

const resolveCode = (error: HttpError, status: number): string => {

    if (error instanceof AppError) {
        return error.code;
    }

    if (error.code && String(error.code).trim()) {
        return String(error.code);
    }

    return status >= 500 ? 'INTERNAL_ERROR' : 'BAD_REQUEST';

};

const resolveMessage = (error: HttpError, status: number): string => {

    if (error.message && String(error.message).trim()) {
        return error.message;
    }

    return status >= 500 ? 'Internal Server Error': 'Bad Request';

};

const errorHandler = (error: HttpError, _req: Request, res: Response, _next: NextFunction) => {

    void _next;
    
    const status  = resolveStatus(error);
    const code    = resolveCode(error, status);
    const message = resolveMessage(error, status);
    const details = error instanceof AppError ? error.details : undefined;

    if (status >= 500) {
        console.error(error);
        Sentry.captureException(error);
    }

    return res.status(status).json({ status, error: message, code, details });

};

export { errorHandler };