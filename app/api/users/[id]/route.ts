import { query } from '../../../../lib/db';
import { getServerSession } from 'next-auth';
import { getUserID, authOptions } from '@/lib/auth';
import { sql } from '@vercel/postgres';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    const session_user_id = await getUserID(session);
    if (!session_user_id) {
        return new Response(JSON.stringify({ error: 'Unauthorized: session user does not have a valid id' }), { status: 401 });
    }

    const { id } = params;
    const { display_name, icon_path, current_task, current_task_time } = await req.json();

    if (id !== session_user_id) {
        return new Response(JSON.stringify({ error: 'Forbidden: user id does not match session user id' }), { status: 403 });
    }

    try {
        var user;
        if (process.env.NODE_ENV === 'production') {
            const { rows } = await sql`UPDATE users SET display_name = ${display_name}, icon_path = ${icon_path}, current_task = ${current_task}, current_task_time = ${current_task_time} WHERE id = ${id} RETURNING *`;
            user = rows[0];
        } else {
            const { rows } = await query(
                'UPDATE users SET display_name = $1, icon_path = $2, current_task = $3, current_task_time = $4 WHERE id = $5 RETURNING *',
                [display_name, icon_path, current_task, current_task_time, id]
            );
            user = rows[0];
        }
        return new Response(JSON.stringify(user), { status: 200 });
    } catch (error) {
        console.error('Database query failed:', error);
        return new Response(JSON.stringify({ error: 'Failed to update user' }), { status: 500 });
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
        if (process.env.NODE_ENV === 'production') {
            await sql`DELETE FROM users WHERE id = ${id}`;
        } else {
            await query('DELETE FROM users WHERE id = $1', [id]);
        }
        return new Response(null, { status: 204 });
    } catch (error) {
        console.error('Database query failed:', error);
        return new Response(JSON.stringify({ error: 'Failed to delete user' }), { status: 500 });
    }
}