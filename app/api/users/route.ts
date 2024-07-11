import { query } from '../../../lib/db';

export async function GET(req: Request) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
}

export async function POST(req: Request) {
    const { id, display_name, icon_path, current_task, current_task_time } = await req.json();
    try {
        const { rows } = await query('INSERT INTO users (id, display_name, icon_path, current_task, current_task_time) VALUES ($1, $2, $3, $4, $5) RETURNING *', [id, display_name, icon_path, current_task, current_task_time]);
        return new Response(JSON.stringify(rows[0]), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to add user' }), { status: 500 });
    }
}