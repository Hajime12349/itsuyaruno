import { query } from '../../../../lib/db';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const { user_id, task_name, deadline, total_set, current_set, is_complete } = await req.json();

    try {
        const { rows } = await query(
            'UPDATE tasks SET user_id = $1, task_name = $2, deadline = $3, total_set = $4, current_set = $5, is_complete = $6 WHERE id = $7 RETURNING *',
            [user_id, task_name, deadline, total_set, current_set, is_complete, id]
        );
        return new Response(JSON.stringify(rows[0]), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to update task' }), { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        await query('DELETE FROM tasks WHERE id = $1', [id]);
        return new Response(null, { status: 204 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to delete task' }), { status: 500 });
    }
}
