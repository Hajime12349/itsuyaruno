"use client";

import { NextAuthProvider } from "@/app/provider";
import UserRegisterForm from "@/components/register/UserRegisterForm";

export default function RegisterPage() {
  return (
    <NextAuthProvider>
      <UserRegisterForm />
    </NextAuthProvider>
  );
}
