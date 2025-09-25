export class CurrentTaskId {
    private constructor(private readonly _value: number) {}

    static create(value: number): CurrentTaskId {
        if (typeof value !== 'number' || Number.isNaN(value)) {
            throw new Error('CurrentTaskId must be a number');
        }
        if (!Number.isInteger(value) || value < 0) {
            throw new Error('CurrentTaskId must be an integer greater than or equal to 0');
        }
        return new CurrentTaskId(value);
    }

    get value(): number {
        return this._value;
    }
}
