'use client';

import { useEffect, useState } from 'react';

const CRUDApiTest = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch('/api/tasks')
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, []);

  function addTask(task: { user_id: string, task_name: string, deadline: string, total_set: number, current_set: number, is_complete: boolean }) {
    fetch('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(task)
    }).then(() => {
      fetch('/api/tasks')
        .then((res) => res.json())
        .then((data) => setTasks(data));
    });
  }

  function deleteTask(id: number) {
    fetch(`/api/tasks/${id}`, { method: 'DELETE' })
      .then(() => {
        fetch('/api/tasks')
          .then((res) => res.json())
          .then((data) => setTasks(data));
      });
  }

  function updateTask(task: { id: number, user_id: string, task_name: string, deadline: string, total_set: number, current_set: number, is_complete: boolean }) {
    fetch(`/api/tasks/${task.id}`, {
      method: 'PUT',
      body: JSON.stringify(task)
    }).then(() => {
      fetch('/api/tasks')
        .then((res) => res.json())
        .then((data) => setTasks(data));
    });
  }

  return <div>
    <ul>
      {tasks.map((task: { id: number; task_name: string; deadline: string; total_set: number; current_set: number; is_complete: boolean }) => (
        <li key={task.id}>{task.task_name} 
            <button onClick={() => deleteTask(task.id)}>Delete</button>
            <button onClick={() => updateTask({ id: task.id, user_id: 'user123', task_name: 'Updated', deadline: task.deadline, total_set: task.total_set, current_set: task.current_set, is_complete: task.is_complete })}>Update</button>
        </li>
      ))}
      <button onClick={() => addTask({ user_id: 'user123', task_name: 'Test', deadline: new Date().toISOString(), total_set: 1, current_set: 3, is_complete: false })}>Add Task</button>
    </ul>
  </div>
};

export default CRUDApiTest;