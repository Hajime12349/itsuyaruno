"use client";

import { signIn, signOut } from "next-auth/react";

export default function SignOutButton() {
    return (
        <button onClick={() => signOut({
            callbackUrl: "/login",
            redirect: true,
        })}>
            Logout
        </button>
    );
}


