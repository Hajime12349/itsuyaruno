import { BadRequestError } from '@/lib/errors/AppError';

export class UserId {
  private constructor(private readonly _value: string) {}

  static create(value: string): UserId {
    //TODO: デバック用ログ
    //console.log(`Creating UserId with value: ${value}`);

    if (typeof value !== 'string') {
      throw new BadRequestError('UserId must be a string');
    }

    const trimmed = value.trim();
    if (trimmed.length === 0) {
      throw new BadRequestError('UserId must not be empty');
    }
    return new UserId(trimmed);
  }

  get value(): string {
    return this._value;
  }
}
