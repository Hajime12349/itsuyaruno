"use client";

import React from "react";
import styles from "./start_stop_button.module.css";

const StopButton: React.FC = () => {

    const click = () => {
    };

    return (
        <button className={styles.startStopButton} onClick={click}>
            <div className={styles.startStopIcon}>
                <div className={styles.stopIconInner}></div>
                <div className={styles.stopIconInner}></div>
            </div>
        </button>
    );
}

export default StopButton;
