import { query } from '../../../../lib/db';
import { getServerSession } from 'next-auth';
import { authOptions, getUserID } from '@/lib/auth';
import { sql } from '@vercel/postgres';

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    const sessionUserId = await getUserID(session);
    if (!sessionUserId) {
        return new Response(JSON.stringify({ error: 'Unauthorized: session user does not have a valid id' }), { status: 401 });
    }

    const { id } = params;

    try {
        let task;
        if (process.env.NODE_ENV === 'production') {
            const { rows } = await sql`SELECT * FROM tasks WHERE id = ${id} AND user_id = ${sessionUserId}`;
            task = rows[0];
        } else {
            const { rows } = await query('SELECT * FROM tasks WHERE id = $1 AND user_id = $2', [id, sessionUserId]);
            task = rows[0];
        }
        if (!task) {
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
    var { task_name, deadline, total_set, current_set, is_complete } = await req.json();

    if (!deadline) {
        deadline = undefined;
    }

    try {
        var task;
        if (process.env.NODE_ENV === 'production') {
            const { rows } = await sql`UPDATE tasks SET task_name = ${task_name}, deadline = ${deadline}, total_set = ${total_set}, current_set = ${current_set}, is_complete = ${is_complete} WHERE id = ${id} AND user_id = ${session_user_id} RETURNING *`;
            task = rows[0];
        } else {
            const { rows } = await query(
                'UPDATE tasks SET task_name = $1, deadline = $2, total_set = $3, current_set = $4, is_complete = $5 WHERE id = $6 AND user_id = $7 RETURNING *',
                [task_name, deadline, total_set, current_set, is_complete, id, session_user_id]
            );
            task = rows[0];
        }
        if (!task) {
            return new Response(JSON.stringify({ error: 'Forbidden: user_id in updating task does not match session user id' }), { status: 403 });
        }
        return new Response(JSON.stringify(task), { status: 200 });
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
        if (process.env.NODE_ENV === 'production') {
            await sql`DELETE FROM tasks WHERE id = ${id} AND user_id = ${session_user_id}`;
        } else {
            await query('DELETE FROM tasks WHERE id = $1 AND user_id = $2', [id, session_user_id]);
        }
        return new Response(null, { status: 204 });
    } catch (error) {
        console.error('Database query failed:', error);
        return new Response(JSON.stringify({ error: 'Failed to delete task' }), { status: 500 });
    }
}
