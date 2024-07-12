'use client';

import Image from 'next/image';
import { NextAuthProvider } from '@/app/provider'
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getUserID } from '@/lib/auth';

const CRUDApiTestComponent = () => {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState({ id: '', display_name: '', icon_path: '' });

  useEffect(() => {
    fetch('/api/tasks')
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, []);

  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => {
        const user_data = {
          id: data.id as string,
          display_name: data.display_name as string,
          icon_path: data.icon_path as string
        }
        setUser(user_data);
      });
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

  function updateTask(task: { id: number, task_name: string, deadline: string, total_set: number, current_set: number, is_complete: boolean }) {
    fetch(`/api/tasks/${task.id}`, {
      method: 'PUT',
      body: JSON.stringify(task)
    }).then(() => {
      fetch('/api/tasks')
        .then((res) => res.json())
        .then((data) => setTasks(data));
    });
  }

  function registerUser() {
    fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({ id: getUserID(session), display_name: session?.user?.name, icon_path: session?.user?.image })
    });
  }

  return <div>
    <h2>user info (session)</h2>
    <p>{session?.user?.name}</p>
    <p>{session?.user?.email}</p>
    <p>{getUserID(session)}</p>
    <button onClick={registerUser}>Register User</button>
    <h2>user info (database)</h2>
    <p>{user.id}</p>
    <p>{user.display_name}</p>
    <p>{user.icon_path}</p>
    <ul>
      {tasks.map((task: { id: number; task_name: string; deadline: string; total_set: number; current_set: number; is_complete: boolean }) => (
        <li key={task.id}>{task.task_name}
          <button onClick={() => deleteTask(task.id)}>Delete</button>
          <button onClick={() => updateTask({ id: task.id, task_name: 'Updated', deadline: task.deadline, total_set: task.total_set, current_set: task.current_set, is_complete: task.is_complete })}>Update</button>
        </li>
      ))}
      <button onClick={() => addTask({ user_id: getUserID(session), task_name: 'Test', deadline: new Date().toISOString(), total_set: 1, current_set: 3, is_complete: false })}>Add Task</button>
    </ul>
  </div>
};

const CRUDApiTest = () => {
  return <NextAuthProvider>
    <h1>CRUD api test</h1>
    <CRUDApiTestComponent />
  </NextAuthProvider>
};

export default CRUDApiTest;