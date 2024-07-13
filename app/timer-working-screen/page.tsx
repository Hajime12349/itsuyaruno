import Image from "next/image";
import styles from "./TimerWorkingScreen.module.css";
import Header from '@/components/Header';
import ProgressBar from '@/components/ProgressBar';

export default function TimerWorkingScreen() {
  return (
    <main className={styles.main}>
      <Header />
      <ProgressBar taskName="レポート課題" isTask={true} progress={10} />
    </main>
  );
}
