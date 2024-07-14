"use client";
import ProgressBar from "./ProgressBar";
import React from "react";
import styles from "./StartStopButton.module.css";

interface ButtonProps{
    onClick: () => void;
}

const StartButton: React.FC<ButtonProps> = ({onClick}) => {
    return (
        <button className={styles.startStopButton} onClick={onClick}>
            <div className={styles.startStopIcon}>
                <div className={styles.startIconInner}></div>
            </div>
        </button>
    );
}

export default StartButton;