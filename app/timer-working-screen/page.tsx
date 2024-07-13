import Image from "next/image";
import styles from "./TimerWorkingScreen.module.css";
import Header from '@/components/Header';
import ProgressBar from '@/components/ProgressBar';

export default function TimerWorkingScreen() {
  return (
    <main className={styles.main}>
      <Header />
      <div className={styles.TaskTextComponets}>
        <h2 className={styles.TaskText}>レポート課題 25分</h2>
        <h2 className={styles.TaskLogo}>ロゴマーク</h2>
      </div>
      <ProgressBar taskName="レポート課題" isTask={true} progress={10} />
      <div className={styles.TimeButtons}>
        <button className={styles.ButtonPause}>一時停止ボタン</button>
      </div>
    </main>
  );
}
