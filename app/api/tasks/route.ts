import { getServerSession } from 'next-auth';
import { authOptions, getUserID } from '@/lib/auth';
import { query } from '@/lib/db';
import { sql } from '@vercel/postgres';
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
        if (process.env.NODE_ENV === 'production') {
            const { rows } = await sql`SELECT * FROM tasks WHERE user_id = ${session_user_id} ${include_complete ? '' : 'AND is_complete = false '} ORDER BY id ASC`;
            return new Response(JSON.stringify(rows), { status: 200 });
        } else {
            const { rows } = await query('SELECT * FROM tasks WHERE user_id = $1 ' + (include_complete ? '' : 'AND is_complete = false ') + 'ORDER BY id ASC', [session_user_id]);
            return new Response(JSON.stringify(rows), { status: 200 });
        }
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
        if (process.env.NODE_ENV === 'production') {
            const { rows } = await sql`INSERT INTO tasks (user_id, task_name, deadline, total_set, current_set, is_complete) VALUES (${session_user_id}, ${task_name}, ${deadline}, ${total_set}, ${current_set}, ${is_complete}) RETURNING *`;
            return new Response(JSON.stringify(rows[0]), { status: 201 });
        } else {
            const { rows } = await query('INSERT INTO tasks (user_id, task_name, deadline, total_set, current_set, is_complete) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [session_user_id, task_name, deadline, total_set, current_set, is_complete]);
            return new Response(JSON.stringify(rows[0]), { status: 201 });
        }
    } catch (error) {
        console.error('Database query failed:', error);
        return new Response(JSON.stringify({ error: 'Failed to add task' }), { status: 500 });
    }
}
