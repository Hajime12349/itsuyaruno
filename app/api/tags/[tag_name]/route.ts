import { getServerSession } from 'next-auth';
import { authOptions, getUserID } from '@/lib/auth';
import { db, Tag, TagUpdate } from '@/lib/kysely';

export async function PUT(req: Request, { params }: { params: { tag_name: string } }) {
    const session = await getServerSession(authOptions);
    const session_user_id = await getUserID(session);
    if (!session_user_id) {
        return new Response(JSON.stringify({ error: 'Unauthorized: session user does not have a valid id' }), { status: 401 });
    }

    const tag_name = params.tag_name;
    const tagUpdate = await req.json() as TagUpdate;

    let query = db.updateTable('tags').set(tagUpdate).where('tag_name', '=', tag_name);

    try {
        const rows = await query.execute();
        return new Response(JSON.stringify(rows), { status: 200 });
    } catch (error) {
        console.error('Database query failed:', error);
        return new Response(JSON.stringify({ error: 'Failed to update tag' }), { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { tag_name: string } }) {
    const session = await getServerSession(authOptions);
    const session_user_id = await getUserID(session);
    if (!session_user_id) {
        return new Response(JSON.stringify({ error: 'Unauthorized: session user does not have a valid id' }), { status: 401 });
    }

    const { tag_name } = params;

    let query = db.deleteFrom('tags').where('tag_name', '=', tag_name);

    try {
        const rows = await query.execute();
        return new Response(JSON.stringify(rows), { status: 200 });
    } catch (error) {
        console.error('Database query failed:', error);
        return new Response(JSON.stringify({ error: 'Failed to delete tag' }), { status: 500 });
    }
}
