import { BadRequestError } from '@/lib/errors/AppError';

export class TaskId {
    private constructor(private readonly _value: number) {}

    static create(value: number | string): TaskId {
        if (value === null || value === undefined) {
            throw new BadRequestError('TaskId must be provided');
        }
        const numeric = typeof value === 'number' ? value : Number(value);
        if (!Number.isInteger(numeric) || numeric < 1) {
            throw new BadRequestError('TaskId must be a positive integer');
        }
        return new TaskId(numeric);
    }

    get value(): number {
        return this._value;
    }
}
