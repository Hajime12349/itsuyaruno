"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { ITaskDataModel as Task } from "@/application/tasks/TaskDataModelMapper";
import TaskImage from "@/public/icon_3.png";
import StartButton from "./StartButton";
import StopButton from "./StopButton";
import styles from "./ProgressBar.module.css";

//形を定義するのがここ
interface ProgressBarProps {
  task: Task | undefined;
  isTask: boolean;
  onTickComplete?: (context: {
    currentPathname: string;
    task?: Task;
  }) => Promise<void> | void;
}
}

//定義した形の引数を受け取る関数
const ProgressBar: React.FC<ProgressBarProps> = ({
  task,
  isTask,
  onTickComplete,
}) => {

  // const router = useRouter();

  const TIMER_DURATION = process.env.NODE_ENV === "development" ? 5 : 1500;
  const BREAK_DURATION = process.env.NODE_ENV === "development" ? 3 : 300;

  const CURRENT_DURATION = isTask ? TIMER_DURATION : BREAK_DURATION;

  //---------------------------------------------------------------------------------------
  //ここからタイマーのカウント
  //---------------------------------------------------------------------------------------

  //タイマーのカウントを保持
  const [count, setCount] = useState(CURRENT_DURATION);
  //停止か再開かを判別
  const [startFlg, setStartFlg] = useState(true);
  // リダイレクトを一度だけ行うためのフラグ
  const [redirected, setRedirected] = useState(false);

  // タイマー情報の維持用Ref（React Lifecycle外での管理）
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const targetTimeRef = useRef<number | null>(null);
  const countRef = useRef(CURRENT_DURATION);
  
  // コールバック内で最新のprops/stateを参照するためのRef
  const onTickCompleteRef = useRef(onTickComplete);
  const taskRef = useRef(task);

  // propsやstateの変更を反映する
  useEffect(() => {
    countRef.current = count;
    onTickCompleteRef.current = onTickComplete;
    taskRef.current = task;
  }, [count, onTickComplete, task]);

  // タイマーの更新処理
  const handleTick = () => {
    if (targetTimeRef.current === null) return;

    // 現在の「目標終了時刻 - 現在時刻」から残り時間（秒）を割り出し、画面状態を更新
    const remainingTime = Math.max(
      0,
      Math.ceil((targetTimeRef.current - Date.now()) / 1000)
    );

    setCount(remainingTime);

    if (remainingTime <= 0) {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      targetTimeRef.current = null;

      // コールバック重複実行を防ぐため、state の関数形式を使って更新可能か確認
      setRedirected((prev) => {
        if (!prev) {
          if (onTickCompleteRef.current) {
            onTickCompleteRef.current({ 
              currentPathname: window.location.pathname, 
              task: taskRef.current 
            });
          }
          return true;
        }
        return prev;
      });
    }
  };

  //カウントを止める関数。
  const countStop = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    // 残り時間に誤差が出ないようターゲットをリセット
    targetTimeRef.current = null;
    setStartFlg(true);
  };

  //カウントを再開する関数。
  const countStart = () => {
    if (timerRef.current !== null) return;
    // 開始時に「現在時刻 ＋ 残り時間」を目標終了時刻として記録する
    targetTimeRef.current = Date.now() + countRef.current * 1000;
    // ブラウザのバックグラウンド待機の影響を最小限にするため100msごとに高頻度チェック
    timerRef.current = setInterval(handleTick, 100);
    setStartFlg(false);
  };

  // StartButton が押されたときは、ルートに依存せず常にカウントを開始／再開する。
  const handleStartButtonClick = () => {
    countStart();
  };

  //---------------------------------------------------------------------------------------
  //ここからキャンバスの描画
  //---------------------------------------------------------------------------------------
  //ここからキャンバスの描画
  //---------------------------------------------------------------------------------------

  //canvasを定義する
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // キャンバスサイズ更新関数を定義
  const updateCanvasSize = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = 100;
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

      const rectWidth = window.innerWidth * 0.4;
      const rectHeight = 100;
      const x = (canvas.width - rectWidth) / 2;
      const y = (canvas.height - rectHeight) / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "black";
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, rectWidth, rectHeight);

      // 休憩中かどうかで色を分岐（URL ではなく isTask に依存）
      if (isTask === false) {
        ctx.fillStyle = "rgb(251, 253, 161)"; /*黄色（休憩）*/
      } else {
        ctx.fillStyle = "rgb(178, 223, 242)"; /*水色（作業）*/
      }
      ctx.fillRect(
        x + 2,
        y + 2,
        (rectWidth - 4) * (count / CURRENT_DURATION),
        rectHeight - 4,
      );
    }
  };

  // 初期描画とウィンドウサイズ変更時の再描画
  useEffect(() => {
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, [isTask]);

  // count や isTask が変わるたびに再描画
  useEffect(() => {
    updateCanvasSize();
  }, [count, isTask]);

  // 特定のURLにいるときにカウントを自動的にスタートする
  useEffect(() => {
    if (
      window.location.pathname === "/timer-working-screen" ||
      window.location.pathname === "/timer-break-screen"
    ) {
      countStart();
    }
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  //<h1 style={{ fontFamily: "sans-serif", fontWeight: 300, fontSize: "80px", textAlign: "center", marginTop: "100px" }}>{taskName}</h1>
  //<h2 className={styles.TaskText}> {taskName}</h2>
  return (
    <div>
      <div className={styles.TaskAll}>
        <div className={styles.TaskImage}>
          <Image src={TaskImage} alt="Task Image" width={100} height={100} />
        </div>
        <div className={styles.TaskTextComponents}>
          <h2 className={styles.TaskText}>
            {" "}
            {isTask ? task?.task_name || "loading..." : "休憩"}
          </h2>
          <h2 className={styles.TaskLogo}>ロゴマーク</h2>
        </div>
        <canvas
          ref={canvasRef}
          id="canvas-in"
          width="100"
          height="150"
        ></canvas>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "40px",
          }}
        >
          {task &&
            (startFlg ? (
              <StartButton onClick={handleStartButtonClick} />
            ) : (
              <StopButton onClick={countStop} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
