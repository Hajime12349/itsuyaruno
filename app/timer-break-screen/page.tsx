import Image from "next/image";
import styles from "./TimerBreakScreen.module.css";
import Header from '@/components/Header';
import ProgressBar from '@/components/ProgressBar';

export default function TimerBreakScreen() {
  return (
    <main className={styles.main}>
      <Header />  
      <div className={styles.TaskTextComponets}>
        <h2 className={styles.TaskText}>休憩 5分</h2>
        <h2 className={styles.TaskLogo}>ロゴマーク</h2>
      </div>
      <ProgressBar taskName="休憩" isTask={false} progress={10} />
      <div className={styles.TimeButtons}>
        <button className={styles.ButtonPause}>一時停止ボタン</button>
      </div>
    </main>
  );
}
