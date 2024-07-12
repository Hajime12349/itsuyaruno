import { query } from '../../../../lib/db';
import { getServerSession } from 'next-auth';
import { authOptions, getUserID } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    const sessionUserId = await getUserID(session);
    if (!sessionUserId) {
        return new Response(JSON.stringify({ error: 'Unauthorized: session user does not have a valid id' }), { status: 401 });
    }

    const { id } = params;

    try {
        const { rows } = await query('SELECT * FROM tasks WHERE id = $1', [id]);
        const task = rows[0];
        if (task.userId !== sessionUserId) {
            return new Response(JSON.stringify({ error: 'Forbidden: user id does not match session user id' }), { status: 403 });
        }
        return new Response(JSON.stringify(task), { status: 200 });
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
    const { task_name, deadline, total_set, current_set, is_complete } = await req.json();

    try {
        const { rows } = await query('SELECT user_id FROM tasks WHERE id = $1', [id]);
        const user_id = rows[0].user_id;
        if (user_id !== session_user_id) {
            return new Response(JSON.stringify({ error: 'Forbidden: user_id in updating task does not match session user id' }), { status: 403 });
        }
    } catch (error) {
        console.error('Database query failed:', error);
        return new Response(JSON.stringify({ error: 'Failed to update task' }), { status: 500 });
    }

    try {
        const { rows } = await query(
            'UPDATE tasks SET task_name = $1, deadline = $2, total_set = $3, current_set = $4, is_complete = $5 WHERE id = $6 RETURNING *',
            [task_name, deadline, total_set, current_set, is_complete, id]
        );
        return new Response(JSON.stringify(rows[0]), { status: 200 });
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
        const { rows } = await query('SELECT user_id FROM tasks WHERE id = $1', [id]);
        const user_id = rows[0].user_id;
        if (user_id !== session_user_id) {
            return new Response(JSON.stringify({ error: 'Forbidden: user id does not match session user id' }), { status: 403 });
        }

        await query('DELETE FROM tasks WHERE id = $1', [id]);
        return new Response(null, { status: 204 });
    } catch (error) {
        console.error('Database query failed:', error);
        return new Response(JSON.stringify({ error: 'Failed to delete task' }), { status: 500 });
    }
}
