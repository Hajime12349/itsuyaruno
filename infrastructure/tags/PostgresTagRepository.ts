import { sql } from '@vercel/postgres';
import { query } from '@/lib/db';
import { AppError, NotFoundError } from '@/shared/errors/AppError';
import { TagEntity } from '../../domain/tags/Tag';
import type { TagRepository } from '../../domain/tags/TagRepository';
import { TagName } from '../../domain/tags/valueObjects/TagName';

function mapRowToEntity(row: any): TagEntity {
    if (!row || typeof row !== 'object') {
        throw new AppError('InternalError', 'Tag row is invalid');
    }
    return TagEntity.create({ name: TagName.create(row.tag_name) });
}

export class PostgresTagRepository implements TagRepository {
    async findAll(): Promise<TagEntity[]> {
        if (process.env.NODE_ENV === 'production') {
            const { rows } = await sql`SELECT * FROM tags`;
            return rows.map(mapRowToEntity);
        }
        const { rows } = await query('SELECT * FROM tags', []);
        return rows.map(mapRowToEntity);
    }

    async create(tag: TagEntity): Promise<TagEntity> {
        if (process.env.NODE_ENV === 'production') {
            const { rows } = await sql`INSERT INTO tags (tag_name) VALUES (${tag.name.value}) RETURNING *`;
            return mapRowToEntity(rows[0]);
        }
        const { rows } = await query('INSERT INTO tags (tag_name) VALUES ($1) RETURNING *', [tag.name.value]);
        return mapRowToEntity(rows[0]);
    }

    async update(tagName: TagName, newName: TagName): Promise<TagEntity | null> {
        if (process.env.NODE_ENV === 'production') {
            const { rows } = await sql`UPDATE tags SET tag_name = ${newName.value} WHERE tag_name = ${tagName.value} RETURNING *`;
            return rows[0] ? mapRowToEntity(rows[0]) : null;
        }
        const { rows } = await query('UPDATE tags SET tag_name = $1 WHERE tag_name = $2 RETURNING *', [newName.value, tagName.value]);
        return rows[0] ? mapRowToEntity(rows[0]) : null;
    }

    async delete(tagName: TagName): Promise<void> {
        if (process.env.NODE_ENV === 'production') {
            const result = await sql`DELETE FROM tags WHERE tag_name = ${tagName.value}`;
            if ((result.rowCount ?? 0) === 0) {
                throw new NotFoundError('Tag not found');
            }
            return;
        }
        const result = await query('DELETE FROM tags WHERE tag_name = $1', [tagName.value]);
        if ((result.rowCount ?? 0) === 0) {
            throw new NotFoundError('Tag not found');
        }
    }
}
