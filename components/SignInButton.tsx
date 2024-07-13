"use client";

import { signIn } from "next-auth/react";

export default function SignOutButton() {
    return (
        <button onClick={() => signIn("google")}>
            Login With Google
        </button>
    );
}


