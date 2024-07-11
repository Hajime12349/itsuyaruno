import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

// エンドポイントのハンドラーを作成
const handler = NextAuth(authOptions);

// エンドポイントのハンドラーをエクスポート
export { handler as GET, handler as POST };