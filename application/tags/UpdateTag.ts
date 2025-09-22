import type { TagRepository } from '../../domain/tags/TagRepository';
import type { TagEntity } from '../../domain/tags/Tag';

export class UpdateTagUseCase {
    constructor(private readonly tagRepository: TagRepository) {}

    async execute(params: { tagName: string; newName: string; }): Promise<TagEntity | null> {
        return await this.tagRepository.update(params.tagName, params.newName);
    }
}


