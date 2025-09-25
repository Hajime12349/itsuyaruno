export class CurrentTaskTime {
    private constructor(private readonly _value: Date) {}

    static create(value: string): CurrentTaskTime {
        if (typeof value !== 'string') {
            throw new Error('CurrentTaskTime must be a string');
        }
        const trimmed = value.trim();
        if (trimmed.length === 0) {
            throw new Error('CurrentTaskTime must not be empty');
        }
        const parsed = Date.parse(trimmed);
        if (Number.isNaN(parsed)) {
            throw new Error('CurrentTaskTime must be a valid date string');
        }
        return new CurrentTaskTime(new Date(parsed));
    }

    get value(): string {
        return this._value.toISOString();
    }

    get asDate(): Date {
        return new Date(this._value.getTime());
    }
}
