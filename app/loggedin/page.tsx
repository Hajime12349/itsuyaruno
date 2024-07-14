"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getUser } from "@/lib/db_api_wrapper";
import { User } from "@/lib/entity";
import { NextAuthProvider } from "@/app/provider";

const LoggedIn = () => {
    const router = useRouter();

    useEffect(() => {
        getUser()
            .then(
                (user) => {
                    if (user.id) {
                        console.log("user", user);
                        console.log("user.current_task", user.current_task);
                        if (user.current_task) {
                            router.replace("/timer-start-screen");
                            return;
                        } else {
                            router.replace("/task-config-main-screen");
                            return;
                        }
                    }
                    router.replace("/register");
                }
            )
            .catch(() => {
                router.replace("/register");
            });
    }, [router]);

    return (
        <NextAuthProvider>
            <div>
                {
                    <div>
                        loading...
                    </div>
                }
            </div>
        </NextAuthProvider>
    );
};

export default LoggedIn;