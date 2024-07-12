import { query } from '../../../lib/db';
import { getServerSession } from 'next-auth';
import { authOptions, getUserID } from '@/lib/auth';

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    const session_user_id = await getUserID(session);
    if (!session_user_id) {
        return new Response(JSON.stringify({ error: 'Unauthorized: session user does not have a valid id' }), { status: 401 });
    }

    try {
        const { rows } = await query('SELECT * FROM tasks WHERE user_id = $1 ORDER BY id ASC', [session_user_id]);
        return new Response(JSON.stringify(rows), { status: 200 });
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

    try {
        const { rows } = await query('INSERT INTO tasks (user_id, task_name, deadline, total_set, current_set, is_complete) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [session_user_id, task_name, deadline, total_set, current_set, is_complete]);
        return new Response(JSON.stringify(rows[0]), { status: 201 });
    } catch (error) {
        console.error('Database query failed:', error);
        return new Response(JSON.stringify({ error: 'Failed to add task' }), { status: 500 });
    }
}
