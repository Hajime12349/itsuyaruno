import type { UserRepository } from '../../domain/users/UserRepository';
import { UserEntity } from '../../domain/users/User';

export class UpdateUserUseCase {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(input: { id: string; displayName?: string; iconPath?: string; currentTask?: number; currentTaskTime?: string; }): Promise<UserEntity> {
        const entity = UserEntity.create({
            id: input.id,
            displayName: input.displayName,
            iconPath: input.iconPath,
            currentTask: input.currentTask,
            currentTaskTime: input.currentTaskTime,
        });
        return await this.userRepository.update(entity);
    }
}


