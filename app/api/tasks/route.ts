import { getServerSession } from 'next-auth';
import { authOptions, getUserID } from '@/lib/auth';
import { db, NewTask } from '@/lib/kysely';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const session_user_id = await getUserID(session);
    if (!session_user_id) {
        return new Response(JSON.stringify({ error: 'Unauthorized: session user does not have a valid id' }), { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const include_complete = searchParams.get('include_complete') === 'true';

    let query = db.selectFrom('tasks').selectAll().where('user_id', '=', session_user_id);
    if (!include_complete) {
        query = query.where('is_complete', '=', false);
    }

    try {
        const rows = await query.execute();
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
    const newTask = await req.json() as NewTask;

    // when deadline is empty, set it to undefined
    if (!newTask.deadline) {
        newTask.deadline = undefined;
    }

    let query = db.insertInto('tasks').values(newTask);

    try {
        const rows = await query.execute();
        return new Response(JSON.stringify(rows), { status: 200 });
    } catch (error) {
        console.error('Database query failed:', error);
        return new Response(JSON.stringify({ error: 'Failed to create task' }), { status: 500 });
    }
}
