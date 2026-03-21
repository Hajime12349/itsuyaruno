"use client";
import React from "react";
import styles from "./AddTaskButton.module.css";

interface AddTaskButtonProps {
  setIsAddModalActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddTaskButton: React.FC<AddTaskButtonProps> = ({
  setIsAddModalActive,
}) => {
  const handleClick = () => {
    setIsAddModalActive(true);
  };
  return (
    <button type="button" className={styles.addButton} onClick={handleClick}>
      ＋ タスクを追加
    </button>
  );
};

export default AddTaskButton;
