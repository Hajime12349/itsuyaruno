import type { TagRepository } from '../../domain/tags/TagRepository';
import type { TagEntity } from '../../domain/tags/Tag';

export class GetTagsUseCase {
    constructor(private readonly tagRepository: TagRepository) {}

    async execute(): Promise<TagEntity[]> {
        return await this.tagRepository.findAll();
    }
}


