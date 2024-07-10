import React from "react"
import ProgressBar from "../../components/ProgressBar"

export default function ProgressBarUnitTest() {
    return (
        <main>
            <div>
                <ProgressBar isTask={false} progress={50} taskName="数学の宿題" />
            </div>
        </main>
    );
}