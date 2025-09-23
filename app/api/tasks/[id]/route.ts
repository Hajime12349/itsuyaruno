import { getServerSession } from 'next-auth';
import { authOptions, getUserID } from '@/lib/auth';
import { PostgresTaskRepository } from '../../../../infrastructure/tasks/PostgresTaskRepository';
import { GetTaskByIdUseCase } from '../../../../application/tasks/GetTaskById';
import { UpdateTaskUseCase } from '../../../../application/tasks/UpdateTask';
import { DeleteTaskUseCase } from '../../../../application/tasks/DeleteTask';
import { toDTO } from '../../../../interfaces/http/tasks/mappers';

function parseTaskId(rawId: string): number | null {
    const parsed = Number(rawId);
    if (!Number.isInteger(parsed) || parsed <= 0) {
        return null;
    }
    return parsed;
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    const sessionUserId = await getUserID(session);
    if (!sessionUserId) {
        return new Response(JSON.stringify({ error: 'Unauthorized: session user does not have a valid id' }), { status: 401 });
    }

    const { id } = params;
    const taskId = parseTaskId(id);
    if (taskId === null) {
        return new Response(JSON.stringify({ error: 'Bad Request: invalid task id' }), { status: 400 });
    }

    try {
        const repo = new PostgresTaskRepository();
        const usecase = new GetTaskByIdUseCase(repo);
        const entity = await usecase.execute({ id: taskId, userId: sessionUserId });
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
    const taskId = parseTaskId(id);
    if (taskId === null) {
        return new Response(JSON.stringify({ error: 'Bad Request: invalid task id' }), { status: 400 });
    }

    const json = await req.json();
    const { task_name, deadline: raw_deadline, total_set, current_set, is_complete } = json ?? {};
    if (typeof task_name !== 'string' || task_name.trim().length === 0) {
        return new Response(JSON.stringify({ error: 'Bad Request: task_name' }), { status: 400 });
    }
    if (typeof total_set !== 'number' || !Number.isInteger(total_set) || total_set < 1) {
        return new Response(JSON.stringify({ error: 'Bad Request: total_set' }), { status: 400 });
    }
    if (typeof current_set !== 'number' || !Number.isInteger(current_set) || current_set < 0) {
        return new Response(JSON.stringify({ error: 'Bad Request: current_set' }), { status: 400 });
    }
    if (typeof is_complete !== 'boolean') {
        return new Response(JSON.stringify({ error: 'Bad Request: is_complete' }), { status: 400 });
    }
    let deadline = raw_deadline as string | undefined;
    if (deadline === '') {
        deadline = undefined;
    }

    if (!deadline) {
        deadline = undefined;
    }

    try {
        const repo = new PostgresTaskRepository();
        const usecase = new UpdateTaskUseCase(repo);
        const updated = await usecase.execute({
            id: taskId,
            userId: session_user_id,
            name: task_name,
            deadline,
            totalSet: total_set,
            currentSet: current_set,
            isComplete: is_complete,
        });
        return new Response(JSON.stringify(toDTO(updated)), { status: 200 });
    } catch (error) {
        console.error('Database query failed:', error);
        const message = (error as Error)?.message ?? '';
        if (message.startsWith('ValidationError:')) {
            return new Response(JSON.stringify({ error: message }), { status: 400 });
        }
        if (message === 'TaskNotFound') {
            return new Response(JSON.stringify({ error: 'Forbidden: user_id in updating task does not match session user id' }), { status: 403 });
        }
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
    const taskId = parseTaskId(id);
    if (taskId === null) {
        return new Response(JSON.stringify({ error: 'Bad Request: invalid task id' }), { status: 400 });
    }

    try {
        const repo = new PostgresTaskRepository();
        const usecase = new DeleteTaskUseCase(repo);
        await usecase.execute({ id: taskId, userId: session_user_id });
        return new Response(null, { status: 204 });
    } catch (error) {
        console.error('Database query failed:', error);
        const message = (error as Error)?.message ?? '';
        if (message === 'TaskNotFound') {
            return new Response(JSON.stringify({ error: 'Forbidden: user id does not match session user id' }), { status: 403 });
        }
        return new Response(JSON.stringify({ error: 'Failed to delete task' }), { status: 500 });
    }
}
