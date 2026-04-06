import { AppError } from '../../src/application/error/AppError.js';

/**
 * Assert that an async call rejects with an AppError matching
 * the given statusCode and code.
 */
export async function assertAppError(
    fn: () => Promise<unknown>,
    statusCode: number,
    code: string,
): Promise<void> {
    let thrown: unknown;
    try {
        await fn();
        thrown = null;
    } catch (e) {
        thrown = e;
    }

    if (!(thrown instanceof AppError)) {
        throw new Error(
            `Expected AppError(${statusCode}, "${code}") but nothing was thrown or a non-AppError was thrown: ${JSON.stringify(thrown)}`,
        );
    }

    if (thrown.statusCode !== statusCode || thrown.code !== code) {
        throw new Error(
            `Expected AppError(${statusCode}, "${code}") but got AppError(${thrown.statusCode}, "${thrown.code}"): ${thrown.message}`,
        );
    }
}
