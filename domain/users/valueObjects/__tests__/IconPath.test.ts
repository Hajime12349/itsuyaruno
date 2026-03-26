import { describe, expect, it } from '@jest/globals';
import { BadRequestError } from '@/lib/errors/AppError';
import { IconPath } from '../IconPath';

describe('IconPath', () => {
  it('アイコンパスを生成できる', () => {
    const iconPath = IconPath.create('/path/to/icon.png');
    expect(iconPath).toBeInstanceOf(IconPath);
    expect(iconPath.value).toBe('/path/to/icon.png');
  });

  it('前後の空白はトリミングされる', () => {
    const iconPath = IconPath.create('  /path/to/icon.png  ');
    expect(iconPath.value).toBe('/path/to/icon.png');
  });

  it('string以外を渡すとBadRequestErrorを投げる', () => {
    expect(() => IconPath.create(999 as unknown as string)).toThrow('IconPath must be a string');
  });

  it('空文字の場合はBadRequestErrorを投げる', () => {
    expect(() => IconPath.create('')).toThrow('IconPath must not be empty');
  });

  it('空白のみの場合はBadRequestErrorを投げる', () => {
    expect(() => IconPath.create(' ')).toThrow('IconPath must not be empty');
  });

  it('全角スペースの場合でもBadRequestErrorを投げる', () => {
    expect(() => IconPath.create('　')).toThrow('IconPath must not be empty');
  });
});
