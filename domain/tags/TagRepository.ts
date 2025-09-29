import type { TagEntity } from './Tag';
import { TagName } from './valueObjects/TagName';

export interface TagRepository {
    findAll(): Promise<TagEntity[]>;
    create(tag: TagEntity): Promise<TagEntity>;
    update(tagName: TagName, newName: TagName): Promise<TagEntity | null>;
    delete(tagName: TagName): Promise<void>;
}
