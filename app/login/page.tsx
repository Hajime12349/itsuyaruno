"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { NextAuthProvider } from "../provider";

function LoginButton() {
    const router = useRouter();
    const session = useSession();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/loggedin";

    return (
        <button onClick={() => {
            if (session.status === "authenticated") {
                router.push(callbackUrl);
            } else {
                signIn("google", { callbackUrl: "/loggedin" });
            }
        }}>
            Login With Google
        </button>
    );
}

export default function Login() {
    return (
        <NextAuthProvider>
            <Suspense fallback={<div>Loading...</div>}>
                <LoginButton />
            </Suspense>
        </NextAuthProvider>
    );
}