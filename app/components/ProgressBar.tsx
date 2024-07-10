"use client";  
import React, { useRef, useEffect, useState } from 'react';

//const INITIAL_PROGRESS = 0;
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

  //タイマーのカウントを増やす関数。インクリメント関数というらしい。
  const countIncrement = () => {
    setCount((prevCount) => prevCount - 1);
    console.log("カウントダウン -1");
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

      const rectWidth = window.innerWidth * 0.7;
      const rectHeight = 100;
      const x = (canvas.width - rectWidth) / 2;
      const y = (canvas.height - rectHeight) / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, rectWidth, rectHeight);

      ctx.fillStyle = "green";
      ctx.fillRect(x + 2, y + 2, (rectWidth - 4) * (count / 1500), rectHeight - 4);
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

  return (
    <div>
      <div>
        <p style={{ fontSize: "24px" }}>いつやるの？</p>
      </div>

      <h1 style={{ fontSize: "80px" , textAlign: "center", marginTop: "100px" }}>{taskName}</h1>
      <canvas ref={canvasRef} id="canvas-in" width="100" height="150"></canvas>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        {startFlg ? <button onClick={countStart}>カウント開始</button> : <button onClick={countStop}>カウント停止</button>}
      </div>
      <h3>{count}</h3>
    </div>
  );
};

export default ProgressBar;