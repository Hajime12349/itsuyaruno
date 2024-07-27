import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserID } from "@/lib/auth";

import { db, NewUser, UserUpdate } from '@/lib/kysely';

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    const session_user_id = await getUserID(session);
    if (!session_user_id) {
        return new Response(JSON.stringify({ error: 'Unauthorized: session user does not have a valid id' }), { status: 401 });
    }

    let query = db.selectFrom('users').selectAll().where('id', '=', session_user_id);

    try {
        const rows = await query.execute();
        return new Response(JSON.stringify(rows), { status: 200 });
    } catch (error) {
        console.error('Database query failed:', error);
        return new Response(JSON.stringify({ error: 'Failed to get user' }), { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    const session_user_id = await getUserID(session);
    if (!session_user_id) {
        return new Response(JSON.stringify({ error: 'Unauthorized: session user does not have a valid id' }), { status: 401 });
    }

    var newUser = await req.json() as NewUser;

    if (!newUser.id) {
        newUser.id = session_user_id;
    }

    if (newUser.id !== session_user_id) {
        return new Response(JSON.stringify({ error: 'Forbidden: user id does not match session user id' }), { status: 403 });
    }

    let query = db.insertInto('users').values(newUser);

    try {
        const rows = await query.execute();
        return new Response(JSON.stringify(rows), { status: 201 });
    } catch (error) {
        console.error('Database query failed:', error);
        return new Response(JSON.stringify({ error: 'Failed to add user' }), { status: 500 });
    }
}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    const session_user_id = await getUserID(session);
    if (!session_user_id) {
        return new Response(JSON.stringify({ error: 'Unauthorized: session user does not have a valid id' }), { status: 401 });
    }

    var userUpdate = await req.json() as UserUpdate;

    if (!userUpdate.id) {
        userUpdate.id = session_user_id;
    }

    if (userUpdate.id !== session_user_id) {
        return new Response(JSON.stringify({ error: 'Forbidden: user id does not match session user id' }), { status: 403 });
    }

    let query = db.updateTable('users').set(userUpdate).where('id', '=', userUpdate.id);

    try {
        const rows = await query.execute();
        return new Response(JSON.stringify(rows), { status: 200 });
    } catch (error) {
        console.error('Database query failed:', error);
        return new Response(JSON.stringify({ error: 'Failed to update user' }), { status: 500 });
    }
}