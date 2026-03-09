import { describe, expect, it } from '@jest/globals';
import { BadRequestError } from '@/lib/errors/AppError';
import { CurrentTaskId } from '../CurrentTaskId';

describe('CurrentTaskId', () => {
  it('現在のタスクIDを生成できる', () => {
    const currentTaskId = CurrentTaskId.create(999);
    expect(currentTaskId).toBeInstanceOf(CurrentTaskId);
    expect(currentTaskId.value).toBe(999);
  });

  it('数値以外を渡すとBadRequestErrorを投げる', () => {
    expect(() => CurrentTaskId.create('not-a-number' as unknown as number)).toThrow(
      'CurrentTaskId must be a number'
    );
  });

  it('NaNを渡すとBadRequestErrorを投げる', () => {
    expect(() => CurrentTaskId.create(NaN)).toThrow('CurrentTaskId must be a number');
  });

  it('負の数を渡すとBadRequestErrorを投げる', () => {
    expect(() => CurrentTaskId.create(-1)).toThrow(
      'CurrentTaskId must be an integer greater than or equal to 0'
    );
  });

  it('整数でない数値を渡すとBadRequestErrorを投げる', () => {
    expect(() => CurrentTaskId.create(3.14)).toThrow(
      'CurrentTaskId must be an integer greater than or equal to 0'
    );
  });
});
