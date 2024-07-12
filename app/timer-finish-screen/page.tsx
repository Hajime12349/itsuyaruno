import Image from "next/image";
import styles from "./TimerFinishScreen.module.css";
import NavigateTaskButton from "@/components/NavigateTaskButton";
import Header from '@/components/Header';

export default function TimerFinishScreen() {
  return (
    <main className={styles.main}>
      <Header />  
      <div className={styles.FinishTexts}>
        <h2 className={styles.TaskFinishText}>休憩が終了しました！</h2>
        <h2 className={styles.TaskChangeText}>タスクを変更しますか？</h2>
      </div>
      <div className={styles.ControlNextTaskFrame}>
        <button className={styles.TaskContinue}>続ける</button>
        <p className={styles.TextOR}>or</p>
        <svg className={styles.NextTasks}>
        <rect width="300" height="1000" style={{ fill: 'gray', strokeWidth: 3, stroke: 'black' }} />
        </svg>
      </div>
      <div className={styles.NavigateTaskButton}>
        <NavigateTaskButton />
      </div>
    </main>
  );
}

