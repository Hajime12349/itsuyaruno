export class DisplayName {
    private constructor(private readonly _value: string) {}

    static create(value: string): DisplayName {
        if (typeof value !== 'string') {
            throw new Error('DisplayName must be a string');
        }
        const trimmed = value.trim();
        if (trimmed.length === 0) {
            throw new Error('DisplayName must not be empty');
        }
        return new DisplayName(trimmed);
    }

    get value(): string {
        return this._value;
    }
}
