import { getServerSession } from 'next-auth';
import { authOptions, getUserID } from '@/lib/auth';
import { db, NewTag } from '@/lib/kysely';

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    const session_user_id = await getUserID(session);
    if (!session_user_id) {
        return new Response(JSON.stringify({ error: 'Unauthorized: session user does not have a valid id' }), { status: 401 });
    }

    let query = db.selectFrom('tags').selectAll();

    try {
        const rows = await query.execute();
        return new Response(JSON.stringify(rows), { status: 200 });
    } catch (error) {
        console.error('Database query failed:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch tags' }), { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    const session_user_id = await getUserID(session);
    if (!session_user_id) {
        return new Response(JSON.stringify({ error: 'Unauthorized: session user does not have a valid id' }), { status: 401 });
    }
    var newTag = await req.json() as NewTag;

    let query = db.insertInto('tags').values(newTag);

    try {
        const rows = await query.execute();
        return new Response(JSON.stringify(rows), { status: 201 });
    } catch (error) {
        console.error('Database query failed:', error);
        return new Response(JSON.stringify({ error: 'Failed to add tag' }), { status: 500 });
    }
}
