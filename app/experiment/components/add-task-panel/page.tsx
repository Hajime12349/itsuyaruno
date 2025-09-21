"use client"
import AddTaskPanel from "@/components/AddTaskPanel"

export default function AddTaskPanelPage() {
  return (
    <AddTaskPanel onAddTask={(task) => {
      alert(JSON.stringify(task))
    }} />
  )
}