import type { UserRepository } from '../../domain/users/UserRepository';
import { UserEntity } from '../../domain/users/User';
import { UserId } from '../../domain/users/valueObjects/UserId';
import { DisplayName } from '../../domain/users/valueObjects/DisplayName';
import { IconPath } from '../../domain/users/valueObjects/IconPath';
import { CurrentTaskId } from '../../domain/users/valueObjects/CurrentTaskId';
import { CurrentTaskTime } from '../../domain/users/valueObjects/CurrentTaskTime';

export class CreateUserUseCase {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(input: { id: string; displayName?: string; iconPath?: string; currentTask?: number; currentTaskTime?: string; }): Promise<UserEntity> {
        const entity = UserEntity.create({
            id: UserId.create(input.id),
            displayName: input.displayName !== undefined
                ? DisplayName.create(input.displayName)
                : undefined,
            iconPath: input.iconPath !== undefined
                ? IconPath.create(input.iconPath)
                : undefined,
            currentTask: input.currentTask !== undefined
                ? CurrentTaskId.create(input.currentTask)
                : undefined,
            currentTaskTime: input.currentTaskTime !== undefined
                ? CurrentTaskTime.create(input.currentTaskTime)
                : undefined,
        });
        return await this.userRepository.create(entity);
    }
}

