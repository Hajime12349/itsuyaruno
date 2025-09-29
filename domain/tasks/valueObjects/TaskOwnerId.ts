import { BadRequestError } from '@/shared/errors/AppError';

export class TaskOwnerId {
    private constructor(private readonly _value: string) {}

    static create(value: string): TaskOwnerId {
        if (typeof value !== 'string') {
            throw new BadRequestError('TaskOwnerId must be a string');
        }
        const trimmed = value.trim();
        if (trimmed.length === 0) {
            throw new BadRequestError('TaskOwnerId must not be empty');
        }
        return new TaskOwnerId(trimmed);
    }

    get value(): string {
        return this._value;
    }
}
