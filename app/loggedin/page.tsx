"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getUser } from "@/lib/db_api_wrapper";
import { User } from "@/lib/entity";
import { NextAuthProvider } from "@/app/provider";

const LoggedIn = () => {
    const router = useRouter();
    const [user, setUser] = useState<User | undefined>();

    useEffect(() => {
        getUser()
            .then(setUser)
            .then(
                () => {
                    if (user?.id) {
                        router.replace("/timer-start-screen");
                    } else {
                        router.replace("/register");
                    }
                }
            )
            .catch(console.error);
    }, [user, router]);

    return (
        <NextAuthProvider>
            <div>
                {user &&
                    <div>
                        <h1>{user.display_name}</h1>
                    </div>
                }
            </div>
        </NextAuthProvider>
    );
};

export default LoggedIn;