"use client";

import React from "react";
import styles from "./start_stop_button.module.css";

interface ButtonProps{
    onClick: () => void;
}

const StopButton: React.FC<ButtonProps> = ({onClick}) => {
    return (
        <button className={styles.startStopButton} onClick={onClick}>
            <div className={styles.startStopIcon}>
                <div className={styles.stopIconInner}></div>
                <div className={styles.stopIconInner}></div>
            </div>
        </button>
    );
}

export default StopButton;