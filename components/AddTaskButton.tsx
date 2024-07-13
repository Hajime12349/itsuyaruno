"use client";
import React from "react";
import styles from "./AddTaskButton.module.css";

interface AddTaskButtonProps{
    onClick: () => void;
}

const AddTaskButton: React.FC<AddTaskButtonProps> = ({onClick}) => {

    const handleClick = () => {

    }
    return (
        <button className={styles.addButton} onClick={handleClick}>
            +
        </button>
    );
}

export default AddTaskButton;