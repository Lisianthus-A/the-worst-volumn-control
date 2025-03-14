import { useEffect, useRef } from "react";
import { detectMobile } from "@/utils";
// import ac from "@/utils/AudioController";
import styles from "./index.module.css";
import classNames from "classnames";
import type { MouseEvent, TouchEvent } from "react";

const ratio = window.devicePixelRatio || 1;
const canvasWidth = 400 * ratio;
const canvasHeight = 240 * ratio;
const halfHeight = canvasHeight / 2;

const grayLineHeight = 8 * ratio;
const grayLineWidth = 360 * ratio;

const blueLineWidth = 16 * ratio;
const blueLineStartX = 120 * ratio;
// const blueLineDistance = 400 * ratio;

const WhiteCircleRadius = 16 * ratio;
const whiteCircleStart = (canvasWidth - grayLineWidth) / 2;
const whiteCircleEnd = blueLineStartX + blueLineWidth / 2;

const whiteBackgroundAnimate = (ctx: CanvasRenderingContext2D) => {
  ctx.save();
  let frame = 0;
  ctx.fillStyle = "#ffffff";
  const second = 0.4;
  const totalFrame = 60 * second;
  const padding = 40 * ratio;
  const animate = () => {
    if (frame >= totalFrame) {
      ctx.restore();
      return;
    }
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    requestAnimationFrame(animate);
    ++frame;
    ctx.globalAlpha = frame / totalFrame;
    const h = (frame / totalFrame) * (canvasHeight - 2 * padding);
    const y = halfHeight - (halfHeight - padding) * (frame / totalFrame);
    // console.log(`frame ${frame}: ctx.fillRect(0, ${y}, ${canvasWidth}, ${h})`);
    ctx.fillRect(0, y, canvasWidth, h);
  };

  animate();
};

const drawBlueLine = (ctx: CanvasRenderingContext2D, x: number) => {
  ctx.save();
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = "#1890ff";
  ctx.fillRect(x, 0, blueLineWidth, canvasHeight);
  ctx.restore();
};

const drawGrayLine = (ctx: CanvasRenderingContext2D) => {
  ctx.save();
  ctx.fillStyle = "#888888";
  ctx.fillRect(
    (canvasWidth - grayLineWidth) / 2,
    halfHeight - grayLineHeight / 2,
    grayLineWidth,
    grayLineHeight
  );
  ctx.restore();
};

const drawWhiteCircle = (ctx: CanvasRenderingContext2D, x: number) => {
  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(x, halfHeight, WhiteCircleRadius, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
};

function Curling() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const upperCanvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const upperContextRef = useRef<CanvasRenderingContext2D | null>(null);
  const isMobile = detectMobile();
  const stateRef = useRef({
    isDragging: false,
    offset: [0, 0],
    circleX: (whiteCircleStart + whiteCircleEnd) / 2,
    t: [0, 0],
    beginX: 0,
  });

  const handleMouseUp = () => {
    stateRef.current.isDragging = false;
    window.removeEventListener(
      isMobile ? "touchend" : "mouseup",
      handleMouseUp
    );
  };

  const handleTouchMove = (evt: TouchEvent) => {
    if (!stateRef.current.isDragging) {
      return;
    }

    const touch = evt.touches[0];
    const [offsetX] = stateRef.current.offset;
    let x = (touch.pageX - offsetX) * ratio;
    x = Math.max(x, whiteCircleStart);
    x = Math.min(x, blueLineStartX);
    doDrawUpper(x);
  };

  const handleMouseMove = (evt: MouseEvent) => {
    if (!stateRef.current.isDragging) {
      return;
    }

    const [offsetX] = stateRef.current.offset;
    let x = (evt.pageX - offsetX) * ratio;
    x = Math.max(x, whiteCircleStart);
    x = Math.min(x, blueLineStartX);
    doDrawUpper(x);
  };

  const handleMouseDown = (evt: MouseEvent) => {
    if (evt.button !== 0) {
      return;
    }
    const [offsetX, offsetY] = stateRef.current.offset;
    const x = (evt.pageX - offsetX) * ratio;
    const y = (evt.pageY - offsetY) * ratio;
    const distanceToCircle = Math.sqrt(
      Math.pow(x - stateRef.current.circleX, 2) + Math.pow(y - halfHeight, 2)
    );

    const isDragging = distanceToCircle <= WhiteCircleRadius;
    stateRef.current.isDragging = isDragging;

    handleMouseMove(evt);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart = (evt: TouchEvent) => {
    const touch = evt.touches[0];
    const [offsetX, offsetY] = stateRef.current.offset;
    const x = (touch.pageX - offsetX) * ratio;
    const y = (touch.pageY - offsetY) * ratio;
    const distanceToCircle = Math.sqrt(
      Math.pow(x - stateRef.current.circleX, 2) + Math.pow(y - halfHeight, 2)
    );

    const isDragging = distanceToCircle <= WhiteCircleRadius;
    stateRef.current.isDragging = isDragging;

    handleTouchMove(evt);
    window.addEventListener("touchend", handleMouseUp);
  };

  const whiteAnimate = () => {
    const ctx = contextRef.current;
    if (!ctx) {
      return;
    }

    whiteBackgroundAnimate(ctx);
  };

  const doDrawUpper = (x: number) => {
    const ctx = upperContextRef.current;
    if (!ctx) {
      return;
    }
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    const now = Date.now();
    if (now - stateRef.current.t[0] > 100 || x <= stateRef.current.circleX) {
      stateRef.current.t[1] = now;
      stateRef.current.beginX = x;
    }
    stateRef.current.t[0] = now;
    stateRef.current.circleX = x;

    drawGrayLine(ctx);
    drawBlueLine(ctx, blueLineStartX);
    drawWhiteCircle(ctx, x);
    if (x >= blueLineStartX) {
      const duration = Date.now() - stateRef.current.t[1];
      let speed =
        (((blueLineStartX - stateRef.current.beginX) / duration) * 1000) /
        ratio;
      if (isNaN(speed)) {
        speed = 0;
      }
      speed = Math.min(speed, 5000);

      // spped: 0 ~ 5000
      // volume: 20 ~ 100
      const volume = (speed / 5000) * 80 + 20;
      console.log(`%cvolume: ${volume >> 0}`, "color: blue");

      console.log(`range: ${blueLineStartX - stateRef.current.beginX}`);
      console.log(`duration: ${duration}ms`);
      console.log(`speed: ${speed}`);
      handleMouseUp();
      // Todo: animate
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const upperCanvas = upperCanvasRef.current;
    if (!canvas || !upperCanvas) {
      return;
    }

    contextRef.current = canvas.getContext("2d");
    upperContextRef.current = upperCanvas.getContext("2d");
    // upper canvas init
    if (upperContextRef.current) {
      upperContextRef.current.clearRect(0, 0, canvasWidth, canvasHeight);
      drawGrayLine(upperContextRef.current);
      drawBlueLine(upperContextRef.current, blueLineStartX);
      drawWhiteCircle(upperContextRef.current, stateRef.current.circleX);
    }
  }, []);

  useEffect(() => {
    const upperCanvas = upperCanvasRef.current;
    if (!upperCanvas) {
      return;
    }

    const onResize = () => {
      const rect = upperCanvas.getBoundingClientRect();
      stateRef.current.offset = [rect.x, rect.y];
    };

    onResize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <>
      <div className={styles.wrapper}>
        <canvas
          // style={{ position: "relative", zIndex: 100 }}
          ref={canvasRef}
          className={styles.canvas}
          width={canvasWidth}
          height={canvasHeight}
        />
        <canvas
          ref={upperCanvasRef}
          className={classNames(styles.canvas, styles["upper-canvas"])}
          width={canvasWidth}
          height={canvasHeight}
          onMouseDown={isMobile ? undefined : handleMouseDown}
          onMouseMove={isMobile ? undefined : handleMouseMove}
          onTouchStart={isMobile ? handleTouchStart : undefined}
          onTouchMove={isMobile ? handleTouchMove : undefined}
        />
      </div>
      <button onClick={whiteAnimate}>whiteAnimate</button>
    </>
  );
}

export default Curling;
