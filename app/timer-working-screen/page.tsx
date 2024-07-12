import Image from "next/image";
import styles from "./TimerWorkingScreen.module.css";
import Header from '@/components/Header';

export default function TimerWorkingScreen() {
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
        <button className={styles.ButtonPause}>一時停止ボタン</button>
      </div>
    </main>
  );
}
