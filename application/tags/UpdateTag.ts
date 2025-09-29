import { BadRequestError } from '@/shared/errors/AppError';
import type { TagRepository } from '../../domain/tags/TagRepository';
import type { TagEntity } from '../../domain/tags/Tag';

export class UpdateTagUseCase {
    constructor(private readonly tagRepository: TagRepository) {}

    async execute(params: { tagName: string; newName: string; }): Promise<TagEntity | null> {
        const newName = (params.newName ?? '').trim();
        if (newName.length === 0) {
            throw new BadRequestError('BadRequestError: tag name must be non-empty');
        }
        return await this.tagRepository.update(params.tagName, newName);
    }
}


