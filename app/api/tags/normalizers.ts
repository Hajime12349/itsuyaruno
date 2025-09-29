import { BadRequestError } from '@/shared/errors/AppError';

export function normalizeTagName(fieldName: string, value: unknown): string {
    if (typeof value !== 'string') {
        throw new BadRequestError(`${fieldName} must be a string`);
    }
    const trimmed = value.trim();
    if (trimmed.length === 0) {
        throw new BadRequestError(`${fieldName} must not be empty`);
    }
    return trimmed;
}

export function normalizeTagParam(value: string | string[] | undefined): string {
    if (typeof value !== 'string') {
        throw new BadRequestError('tag name must be provided');
    }
    return normalizeTagName('tag name', value);
}
