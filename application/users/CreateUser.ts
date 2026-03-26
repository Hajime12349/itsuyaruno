import type { IUserRepository } from "@/domain/users/IUserRepository";
import { UserEntity } from "@/domain/users/User";
import { UserId } from "@/domain/users/valueObjects/UserId";
import { DisplayName } from "@/domain/users/valueObjects/DisplayName";
import { IconPath } from "@/domain/users/valueObjects/IconPath";
import { CurrentTaskId } from "@/domain/users/valueObjects/CurrentTaskId";
import { CurrentTaskTime } from "@/domain/users/valueObjects/CurrentTaskTime";
import { IUserDataModel as User } from "./UserDataModelMapper";

export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}
  
  async execute(input: User): Promise<UserEntity> {
    const entity = UserEntity.create({
      id: UserId.create(input.id),
      displayName: DisplayName.create(input.displayName),
      iconPath:
        input.iconPath !== undefined
          ? IconPath.create(input.iconPath)
          : undefined,
      currentTask:
        input.currentTask !== undefined
          ? CurrentTaskId.create(input.currentTask)
          : undefined,
      currentTaskTime:
        input.currentTaskTime !== undefined
          ? CurrentTaskTime.create(input.currentTaskTime)
          : undefined,
    });
    return await this.userRepository.create(entity);
  }
}
