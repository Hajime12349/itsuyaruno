import { query } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions, getUserID } from '@/lib/auth';
import { sql } from '@vercel/postgres';

export async function PUT(req: Request, { params }: { params: { tag_name: string } }) {
    const session = await getServerSession(authOptions);
    const session_user_id = await getUserID(session);
    if (!session_user_id) {
        return new Response(JSON.stringify({ error: 'Unauthorized: session user does not have a valid id' }), { status: 401 });
    }

    const { tag_name } = params;
    const { new_tag_name } = await req.json();

    try {
        var tag;
        if (process.env.NODE_ENV === 'production') {
            const { rows } = await sql`UPDATE tags SET tag_name = ${new_tag_name} WHERE tag_name = ${tag_name} RETURNING *`;
            tag = rows[0];
        } else {
            const { rows } = await query(
                'UPDATE tags SET tag_name = $1 WHERE tag_name = $2 RETURNING *',
                [new_tag_name, tag_name]
            );
            tag = rows[0];
        }
        if (!tag) {
            return new Response(JSON.stringify({ error: 'Forbidden: tag_name in updating tag does not match session user id' }), { status: 403 });
        }
        return new Response(JSON.stringify(tag), { status: 200 });
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

    try {
        if (process.env.NODE_ENV === 'production') {
            await sql`DELETE FROM tags WHERE tag_name = ${tag_name}`;
        } else {
            await query('DELETE FROM tags WHERE tag_name = $1', [tag_name]);
        }
        return new Response(null, { status: 204 });
    } catch (error) {
        console.error('Database query failed:', error);
        return new Response(JSON.stringify({ error: 'Failed to delete tag' }), { status: 500 });
    }
}
