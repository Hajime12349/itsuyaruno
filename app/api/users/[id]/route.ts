import { query } from '../../../../lib/db';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const { display_name, icon_path, current_task, current_task_time } = await req.json();

    try {
        const { rows } = await query(
            'UPDATE users SET display_name = $1, icon_path = $2, current_task = $3, current_task_time = $4 WHERE id = $5 RETURNING *',
            [display_name, icon_path, current_task, current_task_time, id]
        );
        return new Response(JSON.stringify(rows[0]), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to update user' }), { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        await query('DELETE FROM users WHERE id = $1', [id]);
        return new Response(null, { status: 204 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to delete user' }), { status: 500 });
    }
}