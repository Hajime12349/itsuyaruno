import Image from "next/image";
import React from 'react';
import TaskPanel from "../components/TaskPanel";

export default function TestComponets() {
  return (
    <main>
      <div>
        <TaskPanel title="title" subtitle="sub" progress="before start" dueIn="3day"/>
      </div>
    </main>
  );
}
