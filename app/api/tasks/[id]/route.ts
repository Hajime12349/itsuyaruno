import { query } from '../../../../lib/db';
import { getServerSession } from 'next-auth';
import { authOptions, getUserID } from '@/lib/auth';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    const session_user_id = await getUserID(session);
    if (!session_user_id) {
        return new Response(JSON.stringify({ error: 'Unauthorized: session user does not have a valid id' }), { status: 401 });
    }

    const { id } = params;
    const { user_id, task_name, deadline, total_set, current_set, is_complete } = await req.json();

    if (user_id !== session_user_id) {
        return new Response(JSON.stringify({ error: 'Forbidden: the requested user does not match the session user' }), { status: 401 });
    }

    try {
        const { rows } = await query(
            'UPDATE tasks SET user_id = $1, task_name = $2, deadline = $3, total_set = $4, current_set = $5, is_complete = $6 WHERE id = $7 RETURNING *',
            [user_id, task_name, deadline, total_set, current_set, is_complete, id]
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

    if (id !== session_user_id) {
        return new Response(JSON.stringify({ error: 'Forbidden: user id does not match session user id' }), { status: 403 });
    }

    try {
        await query('DELETE FROM tasks WHERE id = $1', [id]);
        return new Response(null, { status: 204 });
    } catch (error) {
        console.error('Database query failed:', error);
        return new Response(JSON.stringify({ error: 'Failed to delete task' }), { status: 500 });
    }
}
