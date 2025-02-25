import { useEffect, useRef } from "react";
import { detectMobile } from "@/utils";
import ac from "@/utils/AudioController";
import styles from "./index.module.css";
import type { MouseEvent, TouchEvent } from "react";

// interface CustomDownEvent {
//   button: number;
//   clientX: number;
//   clientY: number;
// }

// interface CustomMoveEvent {
//   clientX: number;
//   clientY: number;
// }

const ratio = window.devicePixelRatio || 1;
const rectSize = 4 * ratio;
const canvasWidth = 200 * ratio;
const canvasHeight = 32 * ratio;
const total = canvasWidth * canvasHeight;

function Whiteboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const isMobile = detectMobile();
  const stateRef = useRef({
    isDrawing: false,
    value: 0,
    offset: [0, 0],
  });

  const doDraw = (x: number, y: number) => {
    const ctx = contextRef.current;
    if (!ctx || !stateRef.current.isDrawing) {
      return;
    }
    const imageData = ctx.getImageData(x, y, rectSize, rectSize).data;
    let whiteCount = 0;
    for (let i = 0; i < imageData.length; i += 4) {
      if (imageData[i] === 255) {
        whiteCount += 1;
      }
    }
    stateRef.current.value += whiteCount;
    ctx.fillRect(x, y, rectSize, rectSize);
    const volume = ((stateRef.current.value / total) * 100) >> 0;
    ac.setVolume(volume);
  };

  const handleMouseUp = () => {
    stateRef.current.isDrawing = false;
    window.removeEventListener(
      isMobile ? "touchend" : "mouseup",
      handleMouseUp
    );
  };

  const handleMouseMove = (evt: MouseEvent) => {
    const [offsetX, offsetY] = stateRef.current.offset;
    doDraw((evt.pageX - offsetX) * ratio, (evt.pageY - offsetY) * ratio);
  };

  const handleTouchMove = (evt: TouchEvent) => {
    const touch = evt.touches[0];
    const [offsetX, offsetY] = stateRef.current.offset;
    doDraw((touch.pageX - offsetX) * ratio, (touch.pageY - offsetY) * ratio);
  };

  const handleMouseDown = (evt: MouseEvent) => {
    if (evt.button !== 0) {
      return;
    }
    stateRef.current.isDrawing = true;
    handleMouseMove(evt);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart = (evt: TouchEvent) => {
    stateRef.current.isDrawing = true;
    handleTouchMove(evt);
    window.addEventListener("touchend", handleMouseUp);
  };

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const ctx = canvasRef.current.getContext("2d", {
      willReadFrequently: true,
    })!;
    contextRef.current = ctx;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "#1890ff";
    ac.setVolume(0);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const onResize = () => {
      stateRef.current.offset = [canvas.offsetLeft, canvas.offsetTop];
    };

    onResize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={styles.canvas}
      width={canvasWidth}
      height={canvasHeight}
      onMouseDown={isMobile ? undefined : handleMouseDown}
      onMouseMove={isMobile ? undefined : handleMouseMove}
      onTouchStart={isMobile ? handleTouchStart : undefined}
      onTouchMove={isMobile ? handleTouchMove : undefined}
    />
  );
}

export default Whiteboard;
