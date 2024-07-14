"use client";
import React from "react";
import styles from "./EditTaskButton.module.css";

interface EditTaskButtonProps{
    onClick: () => void;
}

const EditTaskButton: React.FC<EditTaskButtonProps> = ({onClick}) => {
    return (
        <button className={styles.EditButton} onClick={onClick}>
            タスクを編集
        </button>
    );
}

export default EditTaskButton;