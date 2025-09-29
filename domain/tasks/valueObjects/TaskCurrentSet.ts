import { BadRequestError } from '@/shared/errors/AppError';

export class TaskCurrentSet {
    private constructor(private readonly _value: number) {}

    static create(value: number): TaskCurrentSet {
        if (!Number.isInteger(value) || value < 0) {
            throw new BadRequestError('TaskCurrentSet must be an integer greater than or equal to 0');
        }
        return new TaskCurrentSet(value);
    }

    get value(): number {
        return this._value;
    }
}
