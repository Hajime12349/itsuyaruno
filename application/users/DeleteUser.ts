import type { IUserRepository } from "../../domain/users/IUserRepository";

export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(params: { id: string }): Promise<void> {
    await this.userRepository.delete(params.id);
  }
}
