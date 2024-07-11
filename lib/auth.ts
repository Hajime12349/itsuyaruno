import type { NextAuthOptions, Session, DefaultSession } from "next-auth";
import { getServerSession } from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
    pages: {
        // ログインページのパス
        signIn: "/login",
    },
    session: {
        // セッションの保存方法: jwt(JSON Web Token)
        strategy: "jwt",
    },
    callbacks: {
        jwt: ({ token, user }) => {
            if (user) {
                const u = user as unknown as any;
                return { // JWTにユーザーIDを追加
                    ...token,
                    id: u.id,
                };
            }
            return token;
        },
        session: ({ session, token }) => {
            return {
                ...session,
                user: { // セッションにユーザーIDを追加
                    ...session.user,
                    id: token.id,
                },
            };
        },
    },
};

export async function getUserID(session?: Session | DefaultSession | null): Promise<string | undefined> {
    if (!session) {
        return undefined;
    }
    if (!session.user) {
        return undefined;
    }
    if (!("id" in session.user)) {
        return undefined;
    }
    if (typeof session.user.id !== "string") {
        return undefined;
    }
    return session.user.id;
}