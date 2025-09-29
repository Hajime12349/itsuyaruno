import { getServerSession } from 'next-auth';
import { authOptions, getUserID } from '@/lib/auth';
import { UpdateTagUseCase } from '@/application/tags/UpdateTag';
import { DeleteTagUseCase } from '@/application/tags/DeleteTag';
import { toDTO } from '@/interfaces/http/tags/mappers';
import { resolveTagRepository } from '@/interfaces/http/tags/repositoryProvider';
import { AppError } from '@/shared/errors/AppError';
import { normalizeTagName, normalizeTagParam } from '../normalizers';

export async function PUT(request: Request, { params }: { params: { tagName: string } }) {
    const session = await getServerSession(authOptions);
    const session_user_id = await getUserID(session);
    if (!session_user_id) {
        return Response.json({ error: 'Unauthorized: session user does not have a valid id' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { new_tag_name } = body ?? {};

    try {
        const currentName = normalizeTagParam(params?.tagName);
        const updatedName = normalizeTagName('new_tag_name', new_tag_name);

        const repo = resolveTagRepository();
        const usecase = new UpdateTagUseCase(repo);
        const updated = await usecase.execute({ tagName: currentName, newName: updatedName });
        if (!updated) {
            return Response.json({ error: 'Tag not found' }, { status: 404 });
        }
        return Response.json(toDTO(updated), { status: 200 });
    } catch (error) {
        if (error instanceof AppError) {
            if (error.code === 'BadRequest') {
                return Response.json({ error: error.message }, { status: 400 });
            }
            if (error.code === 'NotFound') {
                return Response.json({ error: error.message }, { status: 404 });
            }
        }
        console.error('Failed to update tag:', error);
        return Response.json({ error: 'Failed to update tag' }, { status: 500 });
    }
}

export async function DELETE(_request: Request, { params }: { params: { tagName: string } }) {
    const session = await getServerSession(authOptions);
    const session_user_id = await getUserID(session);
    if (!session_user_id) {
        return Response.json({ error: 'Unauthorized: session user does not have a valid id' }, { status: 401 });
    }

    try {
        const currentName = normalizeTagParam(params?.tagName);
        const repo = resolveTagRepository();
        const usecase = new DeleteTagUseCase(repo);
        await usecase.execute({ tagName: currentName });
        return new Response(null, { status: 204 });
    } catch (error) {
        if (error instanceof AppError) {
            if (error.code === 'BadRequest') {
                return Response.json({ error: error.message }, { status: 400 });
            }
            if (error.code === 'NotFound') {
                return Response.json({ error: error.message }, { status: 404 });
            }
        }
        console.error('Failed to delete tag:', error);
        return Response.json({ error: 'Failed to delete tag' }, { status: 500 });
    }
}
