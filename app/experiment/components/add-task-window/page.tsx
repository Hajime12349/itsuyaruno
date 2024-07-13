"use client"
import Image from "next/image";
import React, { useState } from 'react';
import TaskWindow from "@/components/AddTaskWindow";

export default function TestComponets() {

  return (
    <main>
      <div>
        <TaskWindow />
      </div>
    </main>
  );
}