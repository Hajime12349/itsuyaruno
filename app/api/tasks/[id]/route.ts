import { getServerSession } from 'next-auth';
import { authOptions, getUserID } from '@/lib/auth';
import { db, TaskUpdate } from '@/lib/kysely';

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    const sessionUserId = await getUserID(session);
    if (!sessionUserId) {
        return new Response(JSON.stringify({ error: 'Unauthorized: session user does not have a valid id' }), { status: 401 });
    }

    const { id } = params;

    let query = db.selectFrom('tasks').selectAll().where('id', '=', parseInt(id)).where('user_id', '=', sessionUserId);

    try {
        const rows = await query.execute();
        return new Response(JSON.stringify(rows), { status: 200 });
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
    const taskUpdate = await req.json() as TaskUpdate;

    if (!taskUpdate.deadline) {
        taskUpdate.deadline = undefined;
    }

    let query = db.updateTable('tasks').set(taskUpdate).where('id', '=', parseInt(id)).where('user_id', '=', session_user_id);

    try {
        const rows = await query.execute();
        return new Response(JSON.stringify(rows), { status: 200 });
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

    let query = db.deleteFrom('tasks').where('id', '=', parseInt(id)).where('user_id', '=', session_user_id);

    try {
        await query.execute();
        return new Response(null, { status: 204 });
    } catch (error) {
        console.error('Database query failed:', error);
        return new Response(JSON.stringify({ error: 'Failed to delete task' }), { status: 500 });
    }
}
