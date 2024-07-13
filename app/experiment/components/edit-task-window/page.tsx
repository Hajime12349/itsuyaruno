"use client"
import Image from "next/image";
import React, { useState } from 'react';
import TaskWindow from "@/components/editTaskWindow";

export default function TestComponets() {

  return (
    <main>
      <div>
        <TaskWindow task_name="test" total_set={3} deadline="2024-05-01" current_set={1} is_complete={false}/>
      </div>
    </main>
  );
}