import type { TagRepository } from '../../domain/tags/TagRepository';

export class DeleteTagUseCase {
    constructor(private readonly tagRepository: TagRepository) {}

    async execute(params: { tagName: string; }): Promise<void> {
        await this.tagRepository.delete(params.tagName);
    }
}


