import { getServerSession } from 'next-auth';
import { authOptions, getUserID } from '@/lib/auth';
import { PostgresTaskRepository } from '../../../infrastructure/tasks/PostgresTaskRepository';
import { GetTasksUseCase } from '../../../application/tasks/GetTasks';
import { CreateTaskUseCase } from '../../../application/tasks/CreateTask';
import { toDTO } from '../../../interfaces/http/tasks/mappers';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const session_user_id = await getUserID(session);
    if (!session_user_id) {
        return new Response(JSON.stringify({ error: 'Unauthorized: session user does not have a valid id' }), { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const include_complete = searchParams.get('include_complete') === 'true';

    try {
        const repo = new PostgresTaskRepository();
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
    var { task_name, deadline, total_set, current_set, is_complete } = await req.json();
    // when deadline is empty, set it to undefined
    if (!deadline) {
        deadline = undefined;
    }

    try {
        const repo = new PostgresTaskRepository();
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
        return new Response(JSON.stringify({ error: 'Failed to add task' }), { status: 500 });
    }
}
