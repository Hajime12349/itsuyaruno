"use client";

import React, { useState } from "react";
import { MdSkipNext } from "react-icons/md";
import styles from "./ProgressBar.module.css";

interface SkipControlProps {
  isTaskMode: boolean;
  onConfirm: () => void;
}

const SkipControl: React.FC<SkipControlProps> = ({ isTaskMode, onConfirm }) => {
  const [showDialog, setShowDialog] = useState(false);

  const message = isTaskMode
    ? "作業をスキップして休憩に切り替えますか？"
    : "休憩をスキップして次の作業に進みますか？";

  const handleConfirm = () => {
    setShowDialog(false);
    onConfirm();
  };

  return (
    <>
      <button
        className={styles.skipButton}
        onClick={() => setShowDialog(true)}
        title="スキップ"
      >
        <MdSkipNext className={styles.skipIcon} />
      </button>

      {showDialog && (
        <div className={styles.skipOverlay}>
          <div className={styles.skipDialog}>
            <p className={styles.skipDialogMessage}>{message}</p>
            <div className={styles.skipDialogButtons}>
              <button
                className={styles.skipConfirmButton}
                onClick={handleConfirm}
              >
                はい
              </button>
              <button
                className={styles.skipCancelButton}
                onClick={() => setShowDialog(false)}
              >
                いいえ
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SkipControl;
