'use client';

import React, { useState } from 'react';
import styles from './ConfigSidebar.module.css'; // CSSモジュールをインポート
import SignOutButton from './SignOutButton';

interface ConfigSidebarProps {
  onClose: () => void;
}

const ConfigSidebar: React.FC<ConfigSidebarProps> = ({ onClose }) => {

  const [isPaused, setIsPaused] = useState(false);

  const handleToggle = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.content}>
        <h2 className={styles.title}>Setting</h2>
        <div className={styles.option}>
          <i className="fas fa-pause"></i>
          <span>一時停止ボタン</span>
          <label className={styles.switch}>
            <input type="checkbox" checked={isPaused} onChange={handleToggle} />
            <span className={styles.slider}></span>
          </label>
        </div>
        <SignOutButton />
        <button className={styles.closeButton} onClick={onClose}>サイドバーを閉じる</button>
      </div>
    </div>
  );
};

export default ConfigSidebar;
