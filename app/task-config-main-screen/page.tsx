import React from 'react';
import styles from './page.module.css';  
import Header from '@/components/Header';

export default function Home() {
  return (
    <main>
      <div>
          <Header />
          <input type="text" placeholder="検索" className={styles.search} />
      </div>
    </main>
  );
}
