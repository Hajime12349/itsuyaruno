import Image from "next/image";
import React from 'react';
import styles from './page.module.css';  

export default function Home() {
  return (
    <main>
      <div>
        <div className={styles.flexContainer}>
          <h1 className={styles.title}>いつやるの？</h1>
          <Image src="/config.png" alt="設定" width={30} height={30} />
        </div>
      <input type="text" placeholder="検索" className={styles.search} />
      </div>
    </main>
  );
}
