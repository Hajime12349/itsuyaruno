import { describe,expect, it} from "@jest/globals";
import { UserId } from "../UserId";

describe("UserId", () => {
  it ("ユーザーIDを生成できる", () => {
    const userId = UserId.create("user-123");
    expect(userId).toBeInstanceOf(UserId);
    expect(userId.value).toBe("user-123");
  });
});
 