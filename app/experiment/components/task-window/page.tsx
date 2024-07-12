import Image from "next/image";
import React from 'react';
import TaskWindow from "@/components/addTaskWindow";

//<TaskPanel title="title" subtitle="sub" progress="before start" dueIn="3day"/>
      
export default function TestComponets() {
  return (
    <main>
      <div>
        <TaskWindow/>
      </div>
    </main>
  );
}
