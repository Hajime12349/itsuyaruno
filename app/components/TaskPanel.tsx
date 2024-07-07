import Image from "next/image";

import React from 'react';

interface TaskPanelProps {
  title: string;
  subtitle: string;
  progress: string;
  dueIn: string;
}

const TaskPanel: React.FC<TaskPanelProps> = ({ title, subtitle, progress, dueIn}) => {
  return (
    <div style={{ border: "1px solid black", borderRadius: "10px", backgroundColor: "pink", padding: "20px", width: "400px", height: "auto" }}>
      <h2 style={{ margin: "0 0 10px 0" }}>{title}</h2>
      <p style={{ margin: "0 0 10px 0" }}>{subtitle}</p>
      <p style={{ margin: "0 0 10px 0" }}>{progress}</p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
      <p style={{ margin: "0", textAlign: "right" }}>あと {dueIn}</p>
    </div>
    </div>
  );
};

export default TaskPanel;