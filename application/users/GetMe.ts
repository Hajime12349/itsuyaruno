import type { UserRepository } from '../../domain/users/UserRepository';
import type { UserEntity } from '../../domain/users/User';

export class GetMeUseCase {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(params: { userId: string }): Promise<UserEntity | null> {
        return await this.userRepository.findById(params.userId);
    }
}


