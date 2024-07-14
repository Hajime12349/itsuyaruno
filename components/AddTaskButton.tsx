"use client";
import React, { useState } from "react";
import styles from "./AddTaskButton.module.css";

interface AddTaskButtonProps{
    setIsAddModalActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddTaskButton: React.FC<AddTaskButtonProps> = ({setIsAddModalActive}) => {
    
    const handleClick = () => {
        setIsAddModalActive(true)
    }
    return (
        <button className={styles.addButton} onClick={handleClick}>
            +
        </button>
    );
}

export default AddTaskButton;