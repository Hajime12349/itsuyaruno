import type { TagRepository } from "../../domain/tags/TagRepository";
import { TagEntity } from "../../domain/tags/Tag";
import { TagName } from "../../domain/tags/valueObjects/TagName";

export class CreateTagUseCase {
  constructor(private readonly tagRepository: TagRepository) {}

  async execute(input: { name: string }): Promise<TagEntity> {
    const entity = TagEntity.create({ name: TagName.create(input.name) });
    return await this.tagRepository.create(entity);
  }
}
