export class IconPath {
    private constructor(private readonly _value: string) {}

    static create(value: string): IconPath {
        if (typeof value !== 'string') {
            throw new Error('IconPath must be a string');
        }
        const trimmed = value.trim();
        if (trimmed.length === 0) {
            throw new Error('IconPath must not be empty');
        }
        return new IconPath(trimmed);
    }

    get value(): string {
        return this._value;
    }
}
