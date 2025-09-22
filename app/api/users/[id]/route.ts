import { getServerSession } from 'next-auth';
import { getUserID, authOptions } from '@/lib/auth';
import { PostgresUserRepository } from '../../../../infrastructure/users/PostgresUserRepository';
import { UpdateUserUseCase } from '../../../../application/users/UpdateUser';
import { DeleteUserUseCase } from '../../../../application/users/DeleteUser';
import { toDTO } from '../../../../interfaces/http/users/mappers';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    const session_user_id = await getUserID(session);
    if (!session_user_id) {
        return new Response(JSON.stringify({ error: 'Unauthorized: session user does not have a valid id' }), { status: 401 });
    }

    const { id } = params;
    const { display_name, icon_path, current_task, current_task_time } = await req.json();

    if (id !== session_user_id) {
        return new Response(JSON.stringify({ error: 'Forbidden: user id does not match session user id' }), { status: 403 });
    }

    try {
        const repo = new PostgresUserRepository();
        const usecase = new UpdateUserUseCase(repo);
        const updated = await usecase.execute({
            id,
            displayName: display_name,
            iconPath: icon_path,
            currentTask: current_task,
            currentTaskTime: current_task_time,
        });
        return new Response(JSON.stringify(toDTO(updated)), { status: 200 });
    } catch (error) {
        console.error('Database query failed:', error);
        return new Response(JSON.stringify({ error: 'Failed to update user' }), { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    const session_user_id = await getUserID(session);
    if (!session_user_id) {
        return new Response(JSON.stringify({ error: 'Unauthorized: session user does not have a valid id' }), { status: 401 });
    }

    const { id } = params;

    if (id !== session_user_id) {
        return new Response(JSON.stringify({ error: 'Forbidden: user id does not match session user id' }), { status: 403 });
    }

    try {
        const repo = new PostgresUserRepository();
        const usecase = new DeleteUserUseCase(repo);
        await usecase.execute({ id });
        return new Response(null, { status: 204 });
    } catch (error) {
        console.error('Database query failed:', error);
        return new Response(JSON.stringify({ error: 'Failed to delete user' }), { status: 500 });
    }
}