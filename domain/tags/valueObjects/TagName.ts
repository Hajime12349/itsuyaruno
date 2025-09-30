import { BadRequestError } from '@/lib/errors/AppError';

const MAX_TAG_NAME_LENGTH = 50;

export class TagName {
    private constructor(private readonly _value: string) {}

    static create(value: string): TagName {
        if (typeof value !== 'string') {
            throw new BadRequestError('TagName must be a string');
        }
        const trimmed = value.trim();
        if (trimmed.length === 0) {
            throw new BadRequestError('TagName must not be empty');
        }
        if (trimmed.length > MAX_TAG_NAME_LENGTH) {
            throw new BadRequestError(`TagName must be ${MAX_TAG_NAME_LENGTH} characters or fewer`);
        }
        return new TagName(trimmed);
    }

    get value(): string {
        return this._value;
    }
}

export { MAX_TAG_NAME_LENGTH };
