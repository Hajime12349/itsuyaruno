"use client";
import AddTaskPanel from "@/components/task-config-main-screen/AddTaskPanel";

export default function AddTaskPanelPage() {
  return (
    <AddTaskPanel
      onAddTask={(task) => {
        alert(JSON.stringify(task));
      }}
    />
  );
}
