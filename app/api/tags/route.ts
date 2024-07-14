import { getServerSession } from 'next-auth';
import { authOptions, getUserID } from '@/lib/auth';
import { query } from '@/lib/db';
import { sql } from '@vercel/postgres';

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    const session_user_id = await getUserID(session);
    if (!session_user_id) {
        return new Response(JSON.stringify({ error: 'Unauthorized: session user does not have a valid id' }), { status: 401 });
    }

    try {
        if (process.env.NODE_ENV === 'production') {
            const { rows } = await sql`SELECT * FROM tags`;
            return new Response(JSON.stringify(rows), { status: 200 });
        } else {
            const { rows } = await query('SELECT * FROM tags', []);
            return new Response(JSON.stringify(rows), { status: 200 });
        }
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
    var { tag_name } = await req.json();

    try {
        if (process.env.NODE_ENV === 'production') {
            const { rows } = await sql`INSERT INTO tags (tag_name) VALUES (${tag_name}) RETURNING *`;
            return new Response(JSON.stringify(rows[0]), { status: 201 });
        } else {
            const { rows } = await query('INSERT INTO tags (tag_name) VALUES ($1) RETURNING *', [tag_name]);
            return new Response(JSON.stringify(rows[0]), { status: 201 });
        }
    } catch (error) {
        console.error('Database query failed:', error);
        return new Response(JSON.stringify({ error: 'Failed to add tag' }), { status: 500 });
    }
}
