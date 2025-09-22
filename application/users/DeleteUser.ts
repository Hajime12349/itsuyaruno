import type { UserRepository } from '../../domain/users/UserRepository';

export class DeleteUserUseCase {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(params: { id: string }): Promise<void> {
        await this.userRepository.delete(params.id);
    }
}


