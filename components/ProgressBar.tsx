"use client";
import React, { useRef, useEffect, useState } from 'react';
import StartButton from './start_button';
import StopButton from './stop_button';
import styles from "./ProgressBar.module.css";
import { getTasks } from "@/lib/db_api_wrapper";
import { Task } from "@/lib/entity";
let timer: NodeJS.Timeout | null = null;

//形を定義するのがここ
interface ProgressBarProps {
  taskName: string;
  isTask: boolean;
  progress: number;
}

//定義した形の引数を受け取る関数
const ProgressBar: React.FC<ProgressBarProps> = ({ isTask, progress, taskName }) => {

  //---------------------------------------------------------------------------------------
  //ここからタイマーのカウント
  //---------------------------------------------------------------------------------------

  //タイマーのカウントを保持
  const [count, setCount] = useState(progress);
  //停止か再開かを判別
  const [startFlg, setStartFlg] = useState(true);
  // リダイレクトを一度だけ行うためのフラグ
  const [redirected, setRedirected] = useState(false);

  //タイマーのカウントを減らす関数。インクリメント関数というらしい。
  const countIncrement = () => {
    setCount((prevCount) => {
      if (prevCount <= 1) {
        if (!redirected) {
          if (window.location.pathname === '/timer-working-screen') {
            window.location.href = '/timer-break-screen'; // カウントが0になったらtimer-break-screenに移動する
          }
          else if (window.location.pathname === '/timer-break-screen') {
            window.location.href = '/timer-finish-screen'; // カウントが0になったらtimer-break-screenに移動する
          }
          setRedirected(true);
        }
        return 0;
      }
      return prevCount - 1;
    });
  };

  //最初に実行される関数。カウント開始。クリーンアップ関数も定義している。
  const startFunc = () => {
    //1秒ごとにcountIncrement関数を実行する。
    timer = setInterval(countIncrement, 1000);

    //Progressbarコンポーネント関数がアンマウントされたら、実行されるクリーンアップ関数。
    return () => {
      console.log("タイマーストップ");
    };
  };

  //カウントを止める関数。
  const countStop = () => {

    // 関数clearIntervalでタイマーを停止する
    if (timer !== null) {
      clearInterval(timer);
    }

    // タイマーを止めた時のカウントを保持する
    setCount(count);
    console.log(count);

    setStartFlg(true);
  };

  //カウントを再開する関数。
  const countStart = () => {

    timer = setInterval(countIncrement, 1000);
    setStartFlg(false);
  };

  //もしtimer-start-screenにいたら、スタートボタンを押した時にtimer-working-screenに移動する。
  const handleStartButtonClick = () => {
    if (window.location.pathname === '/timer-start-screen') {
      window.location.href = '/timer-working-screen'; // 特定のURLに移動する
    } else {
      countStart();
    }
  };

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

      if (window.location.pathname === '/timer-break-screen'){
        ctx.fillStyle = "rgb(251, 253, 161)";/*黄色*/
      }
      else{
        ctx.fillStyle = "rgb(178, 223, 242)";/*水色*/
      }
      ctx.fillRect(x + 2, y + 2, (rectWidth - 4) * (count / progress), rectHeight - 4);
    }
  };

  // 初期描画とウィンドウサイズ変更時の再描画
  useEffect(() => {
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  // countが変わるたびに再描画
  useEffect(() => {
    updateCanvasSize();
  }, [count]);

  // 特定のURLにいるときにカウントを自動的にスタートする
  useEffect(() => {
    if (window.location.pathname === '/timer-working-screen' || window.location.pathname === '/timer-break-screen') {
      countStart();
    }
    return () => {
      if (timer !== null) {
        clearInterval(timer);
      }
    };
  }, []);

  //<h1 style={{ fontFamily: "sans-serif", fontWeight: 300, fontSize: "80px", textAlign: "center", marginTop: "100px" }}>{taskName}</h1>
  return (
    <div>
      <div className={styles.TaskTextComponets}>
        <h2 className={styles.TaskText}>レポート課題 25 min</h2>
        <h2 className={styles.TaskLogo}>ロゴマーク</h2>
      </div>
      <canvas ref={canvasRef} id="canvas-in" width="100" height="150"></canvas>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "40px" }}>
        {startFlg ? <StartButton onClick={handleStartButtonClick} /> : <StopButton onClick={countStop} />}
      </div>
    </div>
  );
};

export default ProgressBar;
