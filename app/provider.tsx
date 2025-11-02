"use client";

import { SessionProvider } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/common/LoadingScreen";

type Props = {
  children?: React.ReactNode;
};

export const NextAuthProvider = ({ children }: Props) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export const WithLoggedIn = ({ children }: Props) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <LoadingScreen />;
  }
  if (status === "unauthenticated") {
    router.replace("/login");
    return <LoadingScreen />;
  }
  return <>{children}</>;
};
