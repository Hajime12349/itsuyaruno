import type { Metadata } from "next";
import "./globals.css";
import { NextAuthProvider } from "./provider";


export const metadata: Metadata = {
  title: "Title",
  description: "description",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="jp">
      <body>
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}
