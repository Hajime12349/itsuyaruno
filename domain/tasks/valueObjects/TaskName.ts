import { BadRequestError } from '@/lib/errors/AppError';

const MAX_NAME_LENGTH = 100;

export class TaskName {
    private constructor(private readonly _value: string) {}

    static create(value: string): TaskName {
        if (typeof value !== 'string') {
            throw new BadRequestError('TaskName must be a string');
        }
        const trimmed = value.trim();
        if (trimmed.length === 0) {
            throw new BadRequestError('TaskName must not be empty');
        }
        if (trimmed.length > MAX_NAME_LENGTH) {
            throw new BadRequestError(`TaskName must be ${MAX_NAME_LENGTH} characters or fewer`);
        }
        return new TaskName(trimmed);
    }

    get value(): string {
        return this._value;
    }
}

export { MAX_NAME_LENGTH as TASK_NAME_MAX_LENGTH };
