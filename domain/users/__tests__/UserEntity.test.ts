/**
 * @jest-environment node
 */
import { describe, expect, it, jest } from "@jest/globals";
import { BadRequestError } from "@/lib/errors/AppError";
import { IUserNotification } from "../IUserNotification";
import { UserEntity } from "../User";
import { CurrentTaskId } from "../valueObjects/CurrentTaskId";
import { CurrentTaskTime } from "../valueObjects/CurrentTaskTime";
import { DisplayName } from "../valueObjects/DisplayName";
import { IconPath } from "../valueObjects/IconPath";
import { UserId } from "../valueObjects/UserId";

describe("UserEntity", () => {
  const generateUserProps = () => {
    const id = UserId.create("user-123");
    const displayName = DisplayName.create("test user 123");
    const iconPath = IconPath.create("/icons/user.png");
    const currentTask = CurrentTaskId.create(999);
    const currentTaskTime = CurrentTaskTime.create("2030-06-01T12:00:00.000Z");

    return {
      id, displayName, iconPath, currentTask, currentTaskTime
    };
  };

  it("ユーザーエンティティを生成できる", () => {
    const props  = generateUserProps();
    const entity = UserEntity.create(props);


    expect(entity).toBeInstanceOf(UserEntity);
    expect(entity._id).toBe(props.id);
    expect(entity._displayName).toBe(props.displayName);
    expect(entity._iconPath).toBe(props.iconPath);
    expect(entity._currentTask).toBe(props.currentTask);
    expect(entity._currentTaskTime).toBe(props.currentTaskTime);
  });

  it("オプショナル項目が未指定でも生成できる", () => {
    const props = generateUserProps();
    const entity = UserEntity.create({
      id: props.id,
      displayName: props.displayName,
    });

    expect(entity._iconPath).toBeUndefined();
    expect(entity._currentTask).toBeUndefined();
    expect(entity._currentTaskTime).toBeUndefined();
  });

  it("UserId 以外を受け取った場合にエラーを投げる", () => {
    const props = generateUserProps();

    expect(() =>
      UserEntity.create({
        id: "invalid-user" as unknown as UserId,
        displayName: props.displayName,
      }),
    ).toThrow(BadRequestError);
  });

  it("DisplayName 以外を受け取った場合にエラーを投げる", () => {
    const props = generateUserProps();

    expect(() =>
      UserEntity.create({
        id: props.id,
        displayName: "invalid-user" as unknown as DisplayName,
      }),
    ).toThrow(BadRequestError);
  });

  it("通知オブジェクトにエンティティ情報を渡すことができる", () => {
    const props = generateUserProps();
    const entity = UserEntity.create(props);
    const notification: IUserNotification = {
      Id: jest.fn(),
      DisplayName: jest.fn(),
      IconPath: jest.fn(),
      CurrentTask: jest.fn(),
      CurrentTaskTime: jest.fn(),
    };

    entity.notify(notification);

    expect(notification.Id).toHaveBeenCalledWith(props.id);
    expect(notification.DisplayName).toHaveBeenCalledWith(props.displayName);
    expect(notification.IconPath).toHaveBeenCalledWith(props.iconPath);
    expect(notification.CurrentTask).toHaveBeenCalledWith(props.currentTask);
    expect(notification.CurrentTaskTime).toHaveBeenCalledWith(
      props.currentTaskTime,
    );
  });
});
