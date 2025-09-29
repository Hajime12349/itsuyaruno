import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';
import { authOptions, getUserID } from '@/lib/auth';
import { GetTasksUseCase } from '../../../application/tasks/GetTasks';
import { CreateTaskUseCase } from '../../../application/tasks/CreateTask';
import { toDTO } from '../../../interfaces/http/tasks/mappers';
import { resolveTaskRepository } from '@/interfaces/http/tasks/repositoryProvider';
import { AppError } from '@/shared/errors/AppError';
import {
    normalizeBoolean,
    normalizeIncludeComplete,
    normalizeNonNegativeInteger,
    normalizeOptionalDeadline,
    normalizePositiveInteger,
    normalizeTaskName,
} from './normalizers';

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const session_user_id = await getUserID(session);
    if (!session_user_id) {
        return Response.json({ error: 'Unauthorized: session user does not have a valid id' }, { status: 401 });
    }

    try {
        const include_complete = normalizeIncludeComplete(req.nextUrl.searchParams.get('include_complete'));
        const repo = resolveTaskRepository();
        const usecase = new GetTasksUseCase(repo);
        const entities = await usecase.execute({ userId: session_user_id, includeComplete: include_complete });
        return Response.json(entities.map(toDTO), { status: 200 });
    } catch (error) {
        if (error instanceof AppError) {
            if (error.code === 'BadRequest') {
                return Response.json({ error: error.message }, { status: 400 });
            }
        }
        console.error('Failed to fetch tasks:', error);
        return Response.json({ error: 'Failed to fetch tasks' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    const session_user_id = await getUserID(session);
    if (!session_user_id) {
        return Response.json({ error: 'Unauthorized: session user does not have a valid id' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { task_name, deadline, total_set, current_set, is_complete } = body ?? {};

    try {
        const name = normalizeTaskName('task_name', task_name);
        const normalizedDeadline = normalizeOptionalDeadline('deadline', deadline);
        const totalSet = normalizePositiveInteger('total_set', total_set);
        const currentSet = normalizeNonNegativeInteger('current_set', current_set);
        const isComplete = normalizeBoolean('is_complete', is_complete);

        const repo = resolveTaskRepository();
        const usecase = new CreateTaskUseCase(repo);
        const created = await usecase.execute({
            userId: session_user_id,
            name,
            deadline: normalizedDeadline,
            totalSet,
            currentSet,
            isComplete,
        });
        return Response.json(toDTO(created), { status: 201 });
    } catch (error) {
        if (error instanceof AppError) {
            if (error.code === 'BadRequest') {
                return Response.json({ error: error.message }, { status: 400 });
            }
        }
        console.error('Failed to add task:', error);
        return Response.json({ error: 'Failed to add task' }, { status: 500 });
    }
}
