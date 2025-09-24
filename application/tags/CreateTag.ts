import type { TagRepository } from '../../domain/tags/TagRepository';
import { TagEntity } from '../../domain/tags/Tag';

export class CreateTagUseCase {
    constructor(private readonly tagRepository: TagRepository) {}

    async execute(input: { name: string; }): Promise<TagEntity> {
        const entity = TagEntity.create({ name: input.name });
        return await this.tagRepository.create(entity);
    }
}


