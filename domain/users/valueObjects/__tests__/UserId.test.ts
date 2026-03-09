import { describe, expect, it } from '@jest/globals';
import { BadRequestError } from '@/lib/errors/AppError';
import { UserId } from '../UserId';

describe('UserId', () => {
  it('ユーザーIDを生成できる', () => {
    const userId = UserId.create('user-123');
    expect(userId).toBeInstanceOf(UserId);
    expect(userId.value).toBe('user-123');
  });

  it('前後の空白はトリミングされる', () => {
    const userId = UserId.create('  user-456  ');
    expect(userId.value).toBe('user-456');
  });

  it('string以外を渡すとBadRequestErrorを投げる', () => {
    expect(() => UserId.create(999 as unknown as string)).toThrow('UserId must be a string');
  });

  it('空文字の場合はBadRequestErrorを投げる', () => {
    expect(() => UserId.create('')).toThrow('UserId must not be empty');
  });

  it('空白のみの場合はBadRequestErrorを投げる', () => {
    expect(() => UserId.create(' ')).toThrow('UserId must not be empty');
  });

  it('全角スペースの場合でもBadRequestErrorを投げる', () => {
    expect(() => UserId.create('　')).toThrow('UserId must not be empty');
  });
});
