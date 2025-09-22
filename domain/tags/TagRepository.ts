import type { TagEntity } from './Tag';

export interface TagRepository {
    findAll(): Promise<TagEntity[]>;
    create(tag: TagEntity): Promise<TagEntity>;
    update(tagName: string, newName: string): Promise<TagEntity | null>;
    delete(tagName: string): Promise<void>;
}


