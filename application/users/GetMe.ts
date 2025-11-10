import type { IUserRepository } from "../../domain/users/IUserRepository";
import type { UserEntity } from "../../domain/users/User";

export class GetMeUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(params: { userId: string }): Promise<UserEntity | null> {
    return await this.userRepository.findById(params.userId);
  }
}
