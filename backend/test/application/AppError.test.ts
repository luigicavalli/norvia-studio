import { AppError, AppErrors } from '../../src/application/error/AppError.js';

describe('AppError', () => {

    it('should set all properties correctly', () => {
        const err = new AppError(400, 'MY_CODE', 'my message', { detail: 1 });

        expect(err).toBeInstanceOf(Error);
        expect(err).toBeInstanceOf(AppError);
        expect(err.statusCode).toBe(400);
        expect(err.code).toBe('MY_CODE');
        expect(err.message).toBe('my message');
        expect(err.details).toEqual({ detail: 1 });
    });

});

describe('AppErrors', () => {

    it('badRequest returns 400', () => {
        const err = AppErrors.badRequest('bad input', 'VALIDATION_ERROR');
        expect(err.statusCode).toBe(400);
        expect(err.code).toBe('VALIDATION_ERROR');
        expect(err.message).toBe('bad input');
    });

    it('badRequest uses default code', () => {
        const err = AppErrors.badRequest('bad');
        expect(err.code).toBe('BAD_REQUEST');
    });

    it('unauthorized returns 401', () => {
        const err = AppErrors.unauthorized('not logged in');
        expect(err.statusCode).toBe(401);
        expect(err.code).toBe('UNAUTHORIZED');
    });

    it('forbidden returns 403', () => {
        const err = AppErrors.forbidden('no access');
        expect(err.statusCode).toBe(403);
        expect(err.code).toBe('FORBIDDEN');
    });

    it('notFound returns 404', () => {
        const err = AppErrors.notFound('resource missing');
        expect(err.statusCode).toBe(404);
        expect(err.code).toBe('NOT_FOUND');
    });

    it('conflict returns 409', () => {
        const err = AppErrors.conflict('already exists');
        expect(err.statusCode).toBe(409);
        expect(err.code).toBe('CONFLICT');
    });

});
