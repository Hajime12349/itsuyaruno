import Image from "next/image";
import styles from "./TimerStartScreen.module.css";
import NavigateTaskButton from "@/components/NavigateTaskButton";
import Header from '@/components/Header';

export default function TimerStartScreen() {
  return (
    <main className={styles.main}>
      <Header />
      <div className={styles.TaskTextComponets}>
        <h2 className={styles.TaskText}>レポート課題 25分</h2>
        <h2 className={styles.TaskLogo}>ロゴマーク</h2>
      </div>
      <div className={styles.ProgressBarframe}>
        <h2 className={styles.TimeGage}>時間ゲージ</h2>
      </div>
      <div className={styles.TimeButtons}>
        <button className={styles.ButtonPlayBack}>再生</button>
        <button className={styles.ButtonPause}>一時停止ボタン</button>
      </div>
      <div className={styles.NavigateTaskButton}>
            <NavigateTaskButton />
      </div>
    </main>
  );
}
