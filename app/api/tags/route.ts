import { getServerSession } from 'next-auth';
import { authOptions, getUserID } from '@/lib/auth';
import { PostgresTagRepository } from '../../../infrastructure/tags/PostgresTagRepository';
import { GetTagsUseCase } from '../../../application/tags/GetTags';
import { CreateTagUseCase } from '../../../application/tags/CreateTag';
import { toDTO } from '../../../interfaces/http/tags/mappers';

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    const session_user_id = await getUserID(session);
    if (!session_user_id) {
        return new Response(JSON.stringify({ error: 'Unauthorized: session user does not have a valid id' }), { status: 401 });
    }

    try {
        const repo = new PostgresTagRepository();
        const usecase = new GetTagsUseCase(repo);
        const tags = await usecase.execute();
        return new Response(JSON.stringify(tags.map(toDTO)), { status: 200 });
    } catch (error) {
        console.error('Database query failed:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch tags' }), { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    const session_user_id = await getUserID(session);
    if (!session_user_id) {
        return new Response(JSON.stringify({ error: 'Unauthorized: session user does not have a valid id' }), { status: 401 });
    }
    var { tag_name } = await req.json();

    try {
        const repo = new PostgresTagRepository();
        const usecase = new CreateTagUseCase(repo);
        const created = await usecase.execute({ name: tag_name });
        return new Response(JSON.stringify(toDTO(created)), { status: 201 });
    } catch (error) {
        console.error('Database query failed:', error);
        return new Response(JSON.stringify({ error: 'Failed to add tag' }), { status: 500 });
    }
}
