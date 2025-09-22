import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserID } from "@/lib/auth";
import { PostgresUserRepository } from '../../../infrastructure/users/PostgresUserRepository';
import { GetMeUseCase } from '../../../application/users/GetMe';
import { CreateUserUseCase } from '../../../application/users/CreateUser';
import { UpdateUserUseCase } from '../../../application/users/UpdateUser';
import { toDTO } from '../../../interfaces/http/users/mappers';

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

    var { id, display_name, icon_path, current_task, current_task_time } = await req.json();

    if (!id) {
        id = session_user_id;
    }

    if (id !== session_user_id) {
        return new Response(JSON.stringify({ error: 'Forbidden: user id does not match session user id' }), { status: 403 });
    }

    try {
        const repo = new PostgresUserRepository();
        const usecase = new CreateUserUseCase(repo);
        const created = await usecase.execute({
            id,
            displayName: display_name,
            iconPath: icon_path,
            currentTask: current_task,
            currentTaskTime: current_task_time,
        });
        return new Response(JSON.stringify(toDTO(created)), { status: 201 });
    } catch (error) {
        console.error('Database query failed:', error);
        return new Response(JSON.stringify({ error: 'Failed to add user' }), { status: 500 });
    }
}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    const session_user_id = await getUserID(session);
    if (!session_user_id) {
        return new Response(JSON.stringify({ error: 'Unauthorized: session user does not have a valid id' }), { status: 401 });
    }

    var { id, display_name, icon_path, current_task, current_task_time } = await req.json();

    if (!id) {
        id = session_user_id;
    }

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