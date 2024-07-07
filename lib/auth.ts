import type { NextAuthOptions } from "next-auth";
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