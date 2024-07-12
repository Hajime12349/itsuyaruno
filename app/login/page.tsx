"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginButton() {
    const searchParams = useSearchParams();
    // ログイン後に遷移するページ
    const callbackUrl = searchParams.get("callbackUrl") || "/profile";

    return (
        <button onClick={() => signIn("google", { callbackUrl })}>
            Login With Google
        </button>
    );
}

export default function Login() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginButton />
        </Suspense>
    );
}