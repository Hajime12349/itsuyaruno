import type { TagRepository } from '../../domain/tags/TagRepository';
import type { TagEntity } from '../../domain/tags/Tag';
import { TagName } from '../../domain/tags/valueObjects/TagName';

export class UpdateTagUseCase {
    constructor(private readonly tagRepository: TagRepository) {}

    async execute(params: { tagName: string; newName: string }): Promise<TagEntity | null> {
        const currentName = TagName.create(params.tagName);
        const updatedName = TagName.create(params.newName);
        return await this.tagRepository.update(currentName, updatedName);
    }
}
