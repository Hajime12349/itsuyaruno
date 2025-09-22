import { getServerSession } from 'next-auth';
import { authOptions, getUserID } from '@/lib/auth';
import { PostgresTaskRepository } from '../../../../infrastructure/tasks/PostgresTaskRepository';
import { GetTaskByIdUseCase } from '../../../../application/tasks/GetTaskById';
import { UpdateTaskUseCase } from '../../../../application/tasks/UpdateTask';
import { DeleteTaskUseCase } from '../../../../application/tasks/DeleteTask';
import { toDTO } from '../../../../interfaces/http/tasks/mappers';

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    const sessionUserId = await getUserID(session);
    if (!sessionUserId) {
        return new Response(JSON.stringify({ error: 'Unauthorized: session user does not have a valid id' }), { status: 401 });
    }

    const { id } = params;

    try {
        const repo = new PostgresTaskRepository();
        const usecase = new GetTaskByIdUseCase(repo);
        const entity = await usecase.execute({ id: Number(id), userId: sessionUserId });
        if (!entity) {
            return new Response(JSON.stringify({ error: 'Forbidden: user id does not match session user id' }), { status: 403 });
        }
        return new Response(JSON.stringify(toDTO(entity)), { status: 200 });
    } catch (error) {
        console.error('Database query failed:', error);
        return new Response(JSON.stringify({ error: 'Failed to get task' }), { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    const session_user_id = await getUserID(session);
    if (!session_user_id) {
        return new Response(JSON.stringify({ error: 'Unauthorized: session user does not have a valid id' }), { status: 401 });
    }

    const { id } = params;
    var { task_name, deadline, total_set, current_set, is_complete } = await req.json();

    if (!deadline) {
        deadline = undefined;
    }

    try {
        const repo = new PostgresTaskRepository();
        const usecase = new UpdateTaskUseCase(repo);
        const updated = await usecase.execute({
            id: Number(id),
            userId: session_user_id,
            name: task_name,
            deadline,
            totalSet: total_set,
            currentSet: current_set,
            isComplete: is_complete,
        });
        if (!updated) {
            return new Response(JSON.stringify({ error: 'Forbidden: user_id in updating task does not match session user id' }), { status: 403 });
        }
        return new Response(JSON.stringify(toDTO(updated)), { status: 200 });
    } catch (error) {
        console.error('Database query failed:', error);
        return new Response(JSON.stringify({ error: 'Failed to update task' }), { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    const session_user_id = await getUserID(session);
    if (!session_user_id) {
        return new Response(JSON.stringify({ error: 'Unauthorized: session user does not have a valid id' }), { status: 401 });
    }

    const { id } = params;

    try {
        const repo = new PostgresTaskRepository();
        const usecase = new DeleteTaskUseCase(repo);
        await usecase.execute({ id: Number(id), userId: session_user_id });
        return new Response(null, { status: 204 });
    } catch (error) {
        console.error('Database query failed:', error);
        return new Response(JSON.stringify({ error: 'Failed to delete task' }), { status: 500 });
    }
}
