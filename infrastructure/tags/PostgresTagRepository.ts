import { sql } from '@vercel/postgres';
import { query } from '@/lib/db';
import { TagEntity } from '../../domain/tags/Tag';
import type { TagRepository } from '../../domain/tags/TagRepository';

function mapRowToEntity(row: any): TagEntity {
    return TagEntity.create({ name: row.tag_name });
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
            const { rows } = await sql`INSERT INTO tags (tag_name) VALUES (${tag.name}) RETURNING *`;
            return mapRowToEntity(rows[0]);
        }
        const { rows } = await query('INSERT INTO tags (tag_name) VALUES ($1) RETURNING *', [tag.name]);
        return mapRowToEntity(rows[0]);
    }

    async update(tagName: string, newName: string): Promise<TagEntity | null> {
        if (process.env.NODE_ENV === 'production') {
            const { rows } = await sql`UPDATE tags SET tag_name = ${newName} WHERE tag_name = ${tagName} RETURNING *`;
            return rows[0] ? mapRowToEntity(rows[0]) : null;
        }
        const { rows } = await query('UPDATE tags SET tag_name = $1 WHERE tag_name = $2 RETURNING *', [newName, tagName]);
        return rows[0] ? mapRowToEntity(rows[0]) : null;
    }

    async delete(tagName: string): Promise<void> {
        if (process.env.NODE_ENV === 'production') {
            await sql`DELETE FROM tags WHERE tag_name = ${tagName}`;
            return;
        }
        await query('DELETE FROM tags WHERE tag_name = $1', [tagName]);
    }
}


