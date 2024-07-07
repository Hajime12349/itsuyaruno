"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function Login() {
    const searchParams = useSearchParams();
    // ログイン後に遷移するページ
    const callbackUrl = searchParams.get("callbackUrl") || "/profile";

    return (
        <button onClick={() => signIn("google", { callbackUrl })}>
            Login With Google
        </button>
    );
}