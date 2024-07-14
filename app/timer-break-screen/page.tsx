import Image from "next/image";
import styles from "./TimerBreakScreen.module.css";
import Header from '@/components/Header';
import ProgressBar from '@/components/ProgressBar';
import { NextAuthProvider, WithLoggedIn } from '@/app/provider';

export default function TimerBreakScreen() {
  return (
    <NextAuthProvider>
      <WithLoggedIn>
        <main className={styles.main}>
          <Header />
          <ProgressBar task={undefined} isTask={false} progress={10} />
        </main>
      </WithLoggedIn>
    </NextAuthProvider>
  );
}
