import Image from "next/image";
import { redirect } from 'next/navigation'

export default function Home() {
  redirect('/login')
  return (
    <main>
      <div>
        <h1>This is HomePage. This page will be delete.</h1>
        The URL to app is as follows (dev only).<br />
        <a href="http://localhost:3000/timer-start-screen">timer-start-screen</a>
      </div>
    </main>
  );
}
