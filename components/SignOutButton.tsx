"use client";

import { signIn, signOut } from "next-auth/react";
import styles from "./SignOutButton.module.css"

export default function SignOutButton() {
    return (
        <button className={styles.outButton} onClick={() => signOut({
            callbackUrl: "/login",
            redirect: true,
        })}>
            Logout
        </button>
    );
}


