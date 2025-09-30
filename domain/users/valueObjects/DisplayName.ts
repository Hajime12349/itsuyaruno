import { BadRequestError } from '@/lib/errors/AppError';

export class DisplayName {
    private constructor(private readonly _value: string) {}

    static create(value: string): DisplayName {
        if (typeof value !== 'string') {
            throw new BadRequestError('DisplayName must be a string');
        }
        const trimmed = value.trim();
        if (trimmed.length === 0) {
            throw new BadRequestError('DisplayName must not be empty');
        }
        if (trimmed.length > 25) {
            throw new BadRequestError('DisplayName must be 25 characters or fewer');
        }
        return new DisplayName(trimmed);
    }

    get value(): string {
        return this._value;
    }
}
