import type { TagRepository } from '@/domain/tags/TagRepository';
import { PostgresTagRepository } from '@/infrastructure/tags/PostgresTagRepository';

export function resolveTagRepository(): TagRepository {
    return new PostgresTagRepository();
}
