import React from "react";
import ProgressBar from "@/components/ProgressBar";

export default function ProgressBarUnitTest() {
  return (
    <main>
      <div>
        <ProgressBar isTask={false} task={undefined} />
      </div>
    </main>
  );
  //
}
