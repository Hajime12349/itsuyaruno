"use client";  
import React, { useRef, useEffect } from 'react';

interface ProgressBarProps {
  taskName: string;
  isTask: boolean;
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ isTask, progress, taskName }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const updateCanvasSize = () => {
        canvas.width = window.innerWidth;
        canvas.height = 100;
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

        const rectWidth = window.innerWidth * 0.7;
        const rectHeight = 100;
        const x = (canvas.width - rectWidth) / 2;
        const y = (canvas.height - rectHeight) / 2;

        // キャンバスをクリア
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 黒の枠の長方形を描画
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, rectWidth, rectHeight);

        // 緑の長方形を描画
        ctx.fillStyle = "green";
        ctx.fillRect(x + 2, y + 2, rectWidth - 4, rectHeight - 4);
      };

      // 初期描画
      updateCanvasSize();

      // ウィンドウサイズ変更時に再描画
      window.addEventListener('resize', updateCanvasSize);

      // クリーンアップ
      return () => {
        window.removeEventListener('resize', updateCanvasSize);
      };
    } else {
      console.log('canvasを取得できません');
    }
  }, []);

  return (
    <div>
      <div>
        <p style={{ fontSize: "24px" }}>いつやるの？</p>
      </div>

      <h1 style={{ fontSize: "80px" , textAlign: "center", marginTop: "100px" }}>{taskName}</h1>
      <canvas ref={canvasRef} id="canvas-in" width="100" height="150"></canvas>
    </div>
  );
};

export default ProgressBar;
