"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { NextAuthProvider } from "@/app/provider";
import { getUser } from "@/lib/api_wrapper";

const LoggedIn = () => {
  const router = useRouter();

  useEffect(() => {
    getUser()
      .then((user) => {
        if (user.id) {
          console.log("user", user);
          console.log("user.currentTask", user.currentTask);
          if (user.currentTask) {
            router.replace("/timer-start-screen");
            return;
          } else {
            router.replace("/task-config-main-screen");
            return;
          }
        }
        router.replace("/register");
      })
      .catch(() => {
        router.replace("/register");
      });
  }, [router]);

  return (
    <NextAuthProvider>
      <div>{<div>loading...</div>}</div>
    </NextAuthProvider>
  );
};

export default LoggedIn;
