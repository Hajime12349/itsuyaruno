import { getServerSession } from 'next-auth';
import { authOptions, getUserID } from '@/lib/auth';
import { PostgresTagRepository } from '../../../../infrastructure/tags/PostgresTagRepository';
import { UpdateTagUseCase } from '../../../../application/tags/UpdateTag';
import { DeleteTagUseCase } from '../../../../application/tags/DeleteTag';
import { toDTO } from '../../../../interfaces/http/tags/mappers';

export async function PUT(req: Request, { params }: { params: { tag_name: string } }) {
    const session = await getServerSession(authOptions);
    const session_user_id = await getUserID(session);
    if (!session_user_id) {
        return new Response(JSON.stringify({ error: 'Unauthorized: session user does not have a valid id' }), { status: 401 });
    }

    const { tag_name } = params;
    const { new_tag_name } = await req.json();

    try {
        const repo = new PostgresTagRepository();
        const usecase = new UpdateTagUseCase(repo);
        const updated = await usecase.execute({ tagName: tag_name, newName: new_tag_name });
        if (!updated) {
            return new Response(JSON.stringify({ error: 'Forbidden: tag_name in updating tag does not match session user id' }), { status: 403 });
        }
        return new Response(JSON.stringify(toDTO(updated)), { status: 200 });
    } catch (error) {
        console.error('Database query failed:', error);
        return new Response(JSON.stringify({ error: 'Failed to update tag' }), { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { tag_name: string } }) {
    const session = await getServerSession(authOptions);
    const session_user_id = await getUserID(session);
    if (!session_user_id) {
        return new Response(JSON.stringify({ error: 'Unauthorized: session user does not have a valid id' }), { status: 401 });
    }

    const { tag_name } = params;

    try {
        const repo = new PostgresTagRepository();
        const usecase = new DeleteTagUseCase(repo);
        await usecase.execute({ tagName: tag_name });
        return new Response(null, { status: 204 });
    } catch (error) {
        console.error('Database query failed:', error);
        return new Response(JSON.stringify({ error: 'Failed to delete tag' }), { status: 500 });
    }
}
