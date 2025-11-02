import type { TagEntity } from "../../../domain/tags/Tag";

export type TagDTO = {
  tag_name: string;
};

export function toDTO(tag: TagEntity): TagDTO {
  return { tag_name: tag.name.value };
}
