import React from 'react';
import styles from './NavigateTaskButton.module.css';
import Link from 'next/link';

const NavigateTaskButton = () => {
  return (
    <Link href="/task-config-main-screen">
      <button className={styles.navigateTaskButton}>
        <div className={styles.text}>タスク画面</div>
      </button>
    </Link>
  );
};

export default NavigateTaskButton;
