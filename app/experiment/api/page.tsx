'use client';

import { useEffect, useState } from 'react';

const CRUDApiTest = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch('/api/tasks')
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, []);

  return <div>
    <ul>
      {tasks.map((task: { id: number; task_name: string }) => (
        <li key={task.id}>{task.task_name} </li>
      ))}
    </ul>
  </div>
};

export default CRUDApiTest;