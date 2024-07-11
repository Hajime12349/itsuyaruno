import Image from "next/image";
import styles from "./TimerBreakScreen.module.css";

export default function TimerBreakScreen() {
  return (
    <main className={styles.main}>
      <div className={styles.Header}>
        <h1 className={styles.HeaderTitle}>いつやるの？</h1>
        <button className={styles.HeaderButton}>設定ボタン</button>
      </div>
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
