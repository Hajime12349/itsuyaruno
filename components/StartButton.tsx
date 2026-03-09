"use client";
import ProgressBar from "./ProgressBar";
import React from "react";
import styles from "./StartStopButton.module.css";
import { MdPlayArrow } from "react-icons/md";

interface ButtonProps {
  onClick: () => void;
}

const StartButton: React.FC<ButtonProps> = ({ onClick }) => {
  return (
    <button className={styles.startStopButton} onClick={onClick}>
      <div className={styles.startStopIcon}>
        <MdPlayArrow className={styles.muiIcon} />
      </div>
    </button>
  );
};

export default StartButton;
