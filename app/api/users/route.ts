import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserID } from "@/lib/auth";
import { PostgresUserRepository } from '../../../infrastructure/users/PostgresUserRepository';
import { GetMeUseCase } from '../../../application/users/GetMe';
import { CreateUserUseCase } from '../../../application/users/CreateUser';
import { UpdateUserUseCase } from '../../../application/users/UpdateUser';
import { toDTO } from '../../../interfaces/http/users/mappers';

function normalizeOptionalText(fieldName: string, value: unknown): string | undefined {
    if (value === undefined || value === null) {
        return undefined;
    }
    if (typeof value !== 'string') {
        throw new Error(`BadRequest: ${fieldName}`);
    }
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
}

function normalizeOptionalTaskId(fieldName: string, value: unknown): number | undefined {
    if (value === undefined || value === null || value === '') {
        return undefined;
    }
    const numeric = typeof value === 'number' ? value : Number(value);
    if (!Number.isInteger(numeric) || numeric < 0) {
        throw new Error(`BadRequest: ${fieldName}`);
    }
    return numeric;
}

function normalizeOptionalDateTime(fieldName: string, value: unknown): string | undefined {
    if (value === undefined || value === null) {
        return undefined;
    }
    if (typeof value !== 'string') {
        throw new Error(`BadRequest: ${fieldName}`);
    }
    const trimmed = value.trim();
    if (trimmed.length === 0) {
        return undefined;
    }
    const parsed = Date.parse(trimmed);
    if (Number.isNaN(parsed)) {
        throw new Error(`BadRequest: ${fieldName}`);
    }
    return new Date(parsed).toISOString();
}

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    const session_user_id = await getUserID(session);
    if (!session_user_id) {
        return new Response(JSON.stringify({ error: 'Unauthorized: session user does not have a valid id' }), { status: 401 });
    }

    try {
        const repo = new PostgresUserRepository();
        const usecase = new GetMeUseCase(repo);
        const user = await usecase.execute({ userId: session_user_id });
        if (!user) {
            return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
        }
        return new Response(JSON.stringify(toDTO(user)), { status: 200 });
    } catch (error) {
        console.error('Database query failed:', error);
        return new Response(JSON.stringify({ error: 'Failed to get user' }), { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    const session_user_id = await getUserID(session);
    if (!session_user_id) {
        return new Response(JSON.stringify({ error: 'Unauthorized: session user does not have a valid id' }), { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { id: requestedId, display_name, icon_path, current_task, current_task_time } = body ?? {};

    const id = requestedId ?? session_user_id;

    if (id !== session_user_id) {
        return new Response(JSON.stringify({ error: 'Forbidden: user id does not match session user id' }), { status: 403 });
    }

    try {
        const repo = new PostgresUserRepository();
        const usecase = new CreateUserUseCase(repo);
        const created = await usecase.execute({
            id,
            displayName: normalizeOptionalText('display_name', display_name),
            iconPath: normalizeOptionalText('icon_path', icon_path),
            currentTask: normalizeOptionalTaskId('current_task', current_task),
            currentTaskTime: normalizeOptionalDateTime('current_task_time', current_task_time),
        });
        return new Response(JSON.stringify(toDTO(created)), { status: 201 });
    } catch (error) {
        console.error('Database query failed:', error);
        const message = (error as Error)?.message ?? '';
        if (message.startsWith('BadRequest:')) {
            return new Response(JSON.stringify({ error: message }), { status: 400 });
        }
        return new Response(JSON.stringify({ error: 'Failed to add user' }), { status: 500 });
    }
}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    const session_user_id = await getUserID(session);
    if (!session_user_id) {
        return new Response(JSON.stringify({ error: 'Unauthorized: session user does not have a valid id' }), { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { id: requestedId, display_name, icon_path, current_task, current_task_time } = body ?? {};

    const id = requestedId ?? session_user_id;

    if (id !== session_user_id) {
        return new Response(JSON.stringify({ error: 'Forbidden: user id does not match session user id' }), { status: 403 });
    }

    const hasDisplayName = Object.prototype.hasOwnProperty.call(body ?? {}, 'display_name');
    const hasIconPath = Object.prototype.hasOwnProperty.call(body ?? {}, 'icon_path');
    const hasCurrentTask = Object.prototype.hasOwnProperty.call(body ?? {}, 'current_task');
    const hasCurrentTaskTime = Object.prototype.hasOwnProperty.call(body ?? {}, 'current_task_time');

    try {
        const repo = new PostgresUserRepository();
        const getMe = new GetMeUseCase(repo);
        const existing = await getMe.execute({ userId: id });
        if (!existing) {
            return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
        }

        const updateUseCase = new UpdateUserUseCase(repo);
        const updated = await updateUseCase.execute({
            id,
            displayName: hasDisplayName ? normalizeOptionalText('display_name', display_name) : existing.displayName,
            iconPath: hasIconPath ? normalizeOptionalText('icon_path', icon_path) : existing.iconPath,
            currentTask: hasCurrentTask ? normalizeOptionalTaskId('current_task', current_task) : existing.currentTask,
            currentTaskTime: hasCurrentTaskTime ? normalizeOptionalDateTime('current_task_time', current_task_time) : existing.currentTaskTime,
        });
        return new Response(JSON.stringify(toDTO(updated)), { status: 200 });
    } catch (error) {
        console.error('Database query failed:', error);
        const message = (error as Error)?.message ?? '';
        if (message.startsWith('BadRequest:')) {
            return new Response(JSON.stringify({ error: message }), { status: 400 });
        }
        if (message === 'UserNotFound') {
            return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
        }
        return new Response(JSON.stringify({ error: 'Failed to update user' }), { status: 500 });
    }
}