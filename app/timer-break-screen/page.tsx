import Image from "next/image";
import styles from "./TimerBreakScreen.module.css";
import Header from '@/components/Header';
import ProgressBar from '@/components/ProgressBar';

export default function TimerBreakScreen() {
  return (
    <main className={styles.main}>
      <Header />
      <ProgressBar task={undefined} isTask={false} progress={10} />
    </main>
  );
}
