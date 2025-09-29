import type { TagRepository } from '../../domain/tags/TagRepository';
import { TagName } from '../../domain/tags/valueObjects/TagName';

export class DeleteTagUseCase {
    constructor(private readonly tagRepository: TagRepository) {}

    async execute(params: { tagName: string }): Promise<void> {
        const tagName = TagName.create(params.tagName);
        await this.tagRepository.delete(tagName);
    }
}
