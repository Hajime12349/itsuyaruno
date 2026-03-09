"use client";

import React from "react";
import styles from "./StartStopButton.module.css";
import { MdStop } from "react-icons/md";

interface ButtonProps {
  onClick: () => void;
}

const StopButton: React.FC<ButtonProps> = ({ onClick }) => {
  return (
    <button
      className={`${styles.startStopButton} ${styles.stopButton}`}
      onClick={onClick}
    >
      <div className={styles.startStopIcon}>
        <MdStop className={styles.muiIcon} />
      </div>
    </button>
  );
};

export default StopButton;
