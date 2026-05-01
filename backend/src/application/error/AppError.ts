export class AppError extends Error {

    public constructor(
        public readonly statusCode: number,
        public readonly code:       string,
        public          message:    string,
        public readonly details?:   unknown
    ) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
    }

};

export const AppErrors = {
    badRequest: (message: string, code = "BAD_REQUEST", details?: unknown) =>
        new AppError(400, code, message, details),
    unauthorized: (message: string, code = "UNAUTHORIZED", details?: unknown) =>
        new AppError(401, code, message, details),
    forbidden: (message: string, code = "FORBIDDEN", details?: unknown) =>
        new AppError(403, code, message, details),
    notFound: (message: string, code = "NOT_FOUND", details?: unknown) =>
        new AppError(404, code, message, details),
    conflict: (message: string, code = "CONFLICT", details?: unknown) =>
        new AppError(409, code, message, details)
};