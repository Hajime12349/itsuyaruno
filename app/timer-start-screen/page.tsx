import Image from "next/image";
import styles from "./TimerStartScreen.module.css";
import NavigateTaskButton from "@/components/NavigateTaskButton";
import Header from '@/components/Header';
import ProgressBar from '@/components/ProgressBar';

export default function TimerStartScreen() {
  return (
    <main className={styles.main}>
      <Header />
      <div className={styles.TaskTextComponets}>
      <ProgressBar taskName="レポート課題" isTask={true} progress={10} />
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
