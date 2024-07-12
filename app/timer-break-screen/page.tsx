import Image from "next/image";
import styles from "./TimerBreakScreen.module.css";
import Header from '@/components/Header';

export default function TimerBreakScreen() {
  return (
    <main className={styles.main}>
      <Header />  
      <div className={styles.TaskTextComponets}>
        <h2 className={styles.TaskText}>休憩 5分</h2>
        <h2 className={styles.TaskLogo}>ロゴマーク</h2>
      </div>
      <div className={styles.ProgressBarframe}>
        <h2 className={styles.TimeGage}>時間ゲージ</h2>
      </div>
      <div className={styles.TimeButtons}>
        <button className={styles.ButtonPause}>一時停止ボタン</button>
      </div>
    </main>
  );
}
