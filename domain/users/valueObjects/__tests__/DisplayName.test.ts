import { describe, expect, it } from '@jest/globals';
import { BadRequestError } from '@/lib/errors/AppError';
import { DisplayName } from '../DisplayName';

describe('DisplayName', () => {
  it('表示名を生成できる', () => {
    const displayName = DisplayName.create('user-123');
    expect(displayName).toBeInstanceOf(DisplayName);
    expect(displayName.value).toBe('user-123');
  });

  it('前後の空白はトリミングされる', () => {
    const displayName = DisplayName.create('  user-456  ');
    expect(displayName.value).toBe('user-456');
  });

  it('string以外を渡すとBadRequestErrorを投げる', () => {
    expect(() => DisplayName.create(999 as unknown as string)).toThrow(BadRequestError);
    expect(() => DisplayName.create(999 as unknown as string)).toThrow(
      'DisplayName must be a string'
    );
  });

  it('空文字の場合はBadRequestErrorを投げる', () => {
    expect(() => DisplayName.create('')).toThrow('DisplayName must not be empty');
  });

  it('空白のみの場合はBadRequestErrorを投げる', () => {
    expect(() => DisplayName.create(' ')).toThrow('DisplayName must not be empty');
  });

  it('全角スペースの場合でもBadRequestErrorを投げる', () => {
    expect(() => DisplayName.create('　')).toThrow('DisplayName must not be empty');
  });

  it('25文字を超える場合はBadRequestErrorを投げる', () => {
    const longName = 'a'.repeat(26);
    expect(() => DisplayName.create(longName)).toThrow(
      'DisplayName must be 25 characters or fewer'
    );
  });
});
