import { getServerSession } from 'next-auth';
import { authOptions, getUserID } from '@/lib/auth';
import { UpdateTagUseCase } from '@/application/tags/UpdateTag';
import { DeleteTagUseCase } from '@/application/tags/DeleteTag';
import { toDTO } from '@/interfaces/http/tags/mappers';
import { resolveTagRepository } from '@/interfaces/http/tags/repositoryProvider';

async function requireUserId() {
  const session = await getServerSession(authOptions);
  const userId = await getUserID(session);
  if (!userId) {
    throw new Response(JSON.stringify({ error: 'Unauthorized: session user does not have a valid id' }), { status: 401 });
  }
  return userId;
}

function ensureTagName(value: string | string[] | undefined) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Response(JSON.stringify({ error: 'Bad Request: invalid tag name' }), { status: 400 });
  }
  return value.trim();
}

export async function PUT(request: Request, { params }: { params: { tagName: string } }) {
  let currentName: string;
  try {
    currentName = ensureTagName(params?.tagName);
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    throw error;
  }

  const body = await request.json().catch(() => ({}));
  const { new_tag_name } = body ?? {};

  if (typeof new_tag_name !== 'string' || new_tag_name.trim().length === 0) {
    return Response.json({ error: 'BadRequest: new_tag_name' }, { status: 400 });
  }

  const trimmedNewName = new_tag_name.trim();

  try {
    await requireUserId();
    const repo = resolveTagRepository();
    const usecase = new UpdateTagUseCase(repo);
    const updated = await usecase.execute({ tagName: currentName, newName: trimmedNewName });
    if (!updated) {
      return Response.json({ error: 'Tag not found' }, { status: 404 });
    }
    return Response.json(toDTO(updated), { status: 200 });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    const message = (error as Error)?.message ?? '';
    if (message.startsWith('ValidationError:')) {
      return Response.json({ error: message }, { status: 400 });
    }
    console.error('Failed to update tag:', error);
    return Response.json({ error: 'Failed to update tag' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { tagName: string } }) {
  try {
    const currentName = ensureTagName(params?.tagName);
    await requireUserId();
    const repo = resolveTagRepository();
    const usecase = new DeleteTagUseCase(repo);
    await usecase.execute({ tagName: currentName });
    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    console.error('Failed to delete tag:', error);
    return Response.json({ error: 'Failed to delete tag' }, { status: 500 });
  }
}
