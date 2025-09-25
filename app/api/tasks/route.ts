import { getServerSession } from 'next-auth';
import { authOptions, getUserID } from '@/lib/auth';
import { GetTasksUseCase } from '../../../application/tasks/GetTasks';
import { CreateTaskUseCase } from '../../../application/tasks/CreateTask';
import { toDTO } from '../../../interfaces/http/tasks/mappers';
import { NextRequest } from 'next/server';
import { resolveTaskRepository } from '@/interfaces/http/tasks/repositoryProvider';

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const session_user_id = await getUserID(session);
    if (!session_user_id) {
        return new Response(JSON.stringify({ error: 'Unauthorized: session user does not have a valid id' }), { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const includeParam = searchParams.get('include_complete');
    if (includeParam !== null && includeParam !== 'true' && includeParam !== 'false') {
        return new Response(JSON.stringify({ error: 'Bad Request: invalid query' }), { status: 400 });
    }
    const include_complete = includeParam === 'true';

    try {
        const repo = resolveTaskRepository();
        const usecase = new GetTasksUseCase(repo);
        const entities = await usecase.execute({ userId: session_user_id, includeComplete: include_complete });
        return new Response(JSON.stringify(entities.map(toDTO)), { status: 200 });
    } catch (error) {
        console.error('Database query failed:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch tasks' }), { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    const session_user_id = await getUserID(session);
    if (!session_user_id) {
        return new Response(JSON.stringify({ error: 'Unauthorized: session user does not have a valid id' }), { status: 401 });
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
    // when deadline is empty, set it to undefined
    if (!deadline) {
        deadline = undefined;
    }

    try {
        const repo = resolveTaskRepository();
        const usecase = new CreateTaskUseCase(repo);
        const created = await usecase.execute({
            userId: session_user_id,
            name: task_name,
            deadline,
            totalSet: total_set,
            currentSet: current_set,
            isComplete: is_complete,
        });
        return new Response(JSON.stringify(toDTO(created)), { status: 201 });
    } catch (error) {
        console.error('Database query failed:', error);
        const message = (error as Error)?.message ?? '';
        if (message.startsWith('ValidationError:')) {
            return new Response(JSON.stringify({ error: message }), { status: 400 });
        }
        return new Response(JSON.stringify({ error: 'Failed to add task' }), { status: 500 });
    }
}
