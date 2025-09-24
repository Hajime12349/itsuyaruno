import Image from "next/image";
import styles from "./TimerBreakScreen.module.css";
import Header from '@/components/Header';
import ProgressBar from '@/components/ProgressBar';
import { NextAuthProvider, WithLoggedIn } from '@/app/provider';

const BREAK_DURATION = process.env.NODE_ENV === 'development' ? 3 : 300


export default function TimerBreakScreen() {
  return (
    <NextAuthProvider>
      <WithLoggedIn>
        <main className={styles.main}>
          <Header />
          <ProgressBar task={undefined} isTask={false} progress={BREAK_DURATION} />
        </main>
      </WithLoggedIn>
    </NextAuthProvider>
  );
}
