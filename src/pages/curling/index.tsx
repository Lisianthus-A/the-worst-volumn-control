import { useEffect, useRef } from "react";
import { detectMobile } from "@/utils";
// import ac from "@/utils/AudioController";
import styles from "./index.module.css";
import classNames from "classnames";
// TouchEvent
import type { MouseEvent } from "react";

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
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
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
  // start: (canvasWidth - grayLineWidth) / 2
  // end: blueLineStartX + blueLineWidth / 2
  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.arc(x, halfHeight, WhiteCircleRadius, 0, 2 * Math.PI);
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
    offset: [0, 0],
    circleX: (whiteCircleStart + whiteCircleEnd) / 2,
  });

  // const handleMouseMove = (evt: MouseEvent) => {
  //   const [offsetX, offsetY] = stateRef.current.offset;
  //   const x = (evt.pageX - offsetX) * ratio;
  //   const y = (evt.pageY - offsetY) * ratio;
  //   console.log(x, y);
  // };

  const handleMouseDown = (evt: MouseEvent) => {
    if (evt.button !== 0) {
      return;
    }
    const [offsetX, offsetY] = stateRef.current.offset;
    const x = (evt.pageX - offsetX) * ratio;
    const y = (evt.pageY - offsetY) * ratio;
    // const centerOfCircle = [stateRef.current.circleX, halfHeight];
    const distanceToCircle = Math.sqrt(
      Math.pow(x - stateRef.current.circleX, 2) + Math.pow(y - halfHeight, 2)
    );

    if (distanceToCircle <= WhiteCircleRadius) {
      console.log(`(${x}, ${y}) -- ${distanceToCircle}: hit`);
    } else {
      console.log(`(${x}, ${y}) -- ${distanceToCircle}: else`);
    }

    // handleMouseMove(evt);
  };

  const whiteAnimate = () => {
    const ctx = contextRef.current;
    if (!ctx) {
      return;
    }

    whiteBackgroundAnimate(ctx);
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
      drawGrayLine(upperContextRef.current);
      drawBlueLine(upperContextRef.current, blueLineStartX);
      drawWhiteCircle(
        upperContextRef.current,
        (whiteCircleStart + whiteCircleEnd) / 2
      );
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
          // onMouseMove={isMobile ? undefined : handleMouseMove}
          // onTouchStart={isMobile ? handleTouchStart : undefined}
          // onTouchMove={isMobile ? handleTouchMove : undefined}
        />
      </div>
      <button onClick={whiteAnimate}>whiteAnimate</button>
    </>
  );
}

export default Curling;
