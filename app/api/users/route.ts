import { query } from '../../../lib/db';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserID } from "@/lib/auth";
import { sql } from "@vercel/postgres";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    const session_user_id = await getUserID(session);
    if (!session_user_id) {
        return new Response(JSON.stringify({ error: 'Unauthorized: session user does not have a valid id' }), { status: 401 });
    }

    try {
        var user;
        if (process.env.NODE_ENV === 'production') {
            const { rows } = await sql`SELECT * FROM users WHERE id = ${session_user_id}`;
            user = rows[0];
        } else {
            const { rows } = await query('SELECT * FROM users WHERE id = $1', [session_user_id]);
            user = rows[0];
        }
        if (!user) {
            return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
        }
        return new Response(JSON.stringify(user), { status: 200 });
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
        var user;
        if (process.env.NODE_ENV === 'production') {
            const { rows } = await sql`INSERT INTO users (id, display_name, icon_path, current_task, current_task_time) VALUES (${id}, ${display_name}, ${icon_path}, ${current_task}, ${current_task_time}) RETURNING *`;
            user = rows[0];
        } else {
            const { rows } = await query('INSERT INTO users (id, display_name, icon_path, current_task, current_task_time) VALUES ($1, $2, $3, $4, $5) RETURNING *', [id, display_name, icon_path, current_task, current_task_time]);
            user = rows[0];
        }
        return new Response(JSON.stringify(user), { status: 201 });
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
        var user;
        if (process.env.NODE_ENV === 'production') {
            const { rows } = await sql`UPDATE users SET display_name = ${display_name}, icon_path = ${icon_path}, current_task = ${current_task}, current_task_time = ${current_task_time} WHERE id = ${id} RETURNING *`;
            user = rows[0];
        } else {
            const { rows } = await query('UPDATE users SET display_name = $1, icon_path = $2, current_task = $3, current_task_time = $4 WHERE id = $5 RETURNING *', [display_name, icon_path, current_task, current_task_time, id]);
            user = rows[0];
        }
        return new Response(JSON.stringify(user), { status: 200 });
    } catch (error) {
        console.error('Database query failed:', error);
        return new Response(JSON.stringify({ error: 'Failed to update user' }), { status: 500 });
    }
}