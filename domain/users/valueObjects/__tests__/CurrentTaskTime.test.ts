import { describe, expect, it } from '@jest/globals';
import { BadRequestError } from '@/lib/errors/AppError';
import { CurrentTaskTime } from '../CurrentTaskTime';

describe('CurrentTaskTime', () => {
  it('現在のタスク時間を生成できる', () => {
    const currentTaskTime = CurrentTaskTime.create('2020-08-20T00:00:00.000Z');
    expect(currentTaskTime).toBeInstanceOf(CurrentTaskTime);
    expect(currentTaskTime.asString).toBe('2020-08-20T00:00:00.000Z');
  });

  it('前後の空白はトリミングされる', () => {
    const currentTaskTime = CurrentTaskTime.create('  2020-08-20T00:00:00.000Z  ');
    expect(currentTaskTime.asString).toBe('2020-08-20T00:00:00.000Z');
  });

  it('Date形式で取得できる', () => {
    const currentTaskTime = CurrentTaskTime.create('2020-08-20T00:00:00.000Z');
    const dateValue = currentTaskTime.asDate;
    expect(dateValue).toBeInstanceOf(Date);
    expect(dateValue.toISOString()).toBe('2020-08-20T00:00:00.000Z');
  });

  it('string以外を渡すとBadRequestErrorを投げる', () => {
    expect(() => CurrentTaskTime.create(999 as unknown as string)).toThrow(
      'CurrentTaskTime must be a string'
    );
  });

  it('空文字の場合はBadRequestErrorを投げる', () => {
    expect(() => CurrentTaskTime.create('')).toThrow('CurrentTaskTime must not be empty');
  });

  it('空白のみの場合はBadRequestErrorを投げる', () => {
    expect(() => CurrentTaskTime.create(' ')).toThrow('CurrentTaskTime must not be empty');
  });

  it('全角スペースの場合でもBadRequestErrorを投げる', () => {
    expect(() => CurrentTaskTime.create('　')).toThrow('CurrentTaskTime must not be empty');
  });

  it('無効な日付文字列の場合はBadRequestErrorを投げる', () => {
    expect(() => CurrentTaskTime.create('invalid-date-string')).toThrow(
      'CurrentTaskTime must be a valid date string'
    );
  });
});
