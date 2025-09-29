import { BadRequestError } from '@/shared/errors/AppError';

export class TaskTotalSet {
    private constructor(private readonly _value: number) {}

    static create(value: number): TaskTotalSet {
        if (!Number.isInteger(value) || value < 1) {
            throw new BadRequestError('TaskTotalSet must be an integer greater than or equal to 1');
        }
        return new TaskTotalSet(value);
    }

    get value(): number {
        return this._value;
    }
}
