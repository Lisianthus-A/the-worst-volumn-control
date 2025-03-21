import { useEffect, useRef } from "react";
import { detectMobile } from "@/utils";
import ac from "@/utils/AudioController";
import classNames from "classnames";
import layoutStyles from "@/components/Layout/index.module.css";
import styles from "./index.module.css";
import potPng from "./pot.png";
import type { MouseEvent, TouchEvent } from "react";

const ratio = window.devicePixelRatio || 1;
const a = -20;

const CONFIG = {
  canvas: {
    width: 400 * ratio,
    height: 240 * ratio,
    halfHeight: (240 * ratio) / 2,
  },
  grayLine: {
    height: 8 * ratio,
    width: 360 * ratio,
  },
  blueLine: {
    width: 16 * ratio,
    startX: 120 * ratio,
    distance: 400 * ratio,
  },
  whiteCircle: {
    radius: 16 * ratio,
    start: (400 * ratio - 360 * ratio) / 2,
    end: 120 * ratio + (16 * ratio) / 2,
  },
  pot: {
    initSize: 32 * ratio,
    finalSize: 32 * ratio * 1.3,
  },
  whiteRect: {
    padding: 24 * ratio,
  },
};

const drawUtils = {
  blueLine: (ctx: CanvasRenderingContext2D, x: number) => {
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "#1890ff";
    ctx.fillRect(x, 0, CONFIG.blueLine.width, CONFIG.canvas.height);
    ctx.restore();
  },

  grayLine: (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.fillStyle = "#888888";
    ctx.fillRect(
      (CONFIG.canvas.width - CONFIG.grayLine.width) / 2,
      CONFIG.canvas.halfHeight - CONFIG.grayLine.height / 2,
      CONFIG.grayLine.width,
      CONFIG.grayLine.height
    );
    ctx.restore();
  },

  whiteCircle: (ctx: CanvasRenderingContext2D, x: number) => {
    ctx.save();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(
      x,
      CONFIG.canvas.halfHeight,
      CONFIG.whiteCircle.radius,
      0,
      2 * Math.PI
    );
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  },
};

const getEventPosition = (evt: MouseEvent | TouchEvent): [number, number] => {
  const pos = "touches" in evt ? evt.touches[0] : evt;
  return [pos.pageX, pos.pageY];
};

function Curling() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const upperCanvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const upperContextRef = useRef<CanvasRenderingContext2D | null>(null);
  const potImageRef = useRef<HTMLImageElement>(new Image());
  const isMobile = detectMobile();
  const stateRef = useRef({
    isDragging: false,
    offset: [0, 0],
    circleX: (CONFIG.whiteCircle.start + CONFIG.whiteCircle.end) / 2,
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

  const handleInteractionMove = (evt: MouseEvent | TouchEvent) => {
    if (!stateRef.current.isDragging) return;

    const [pageX] = getEventPosition(evt);
    const [offsetX] = stateRef.current.offset;
    let x = (pageX - offsetX) * ratio;
    x = Math.max(x, CONFIG.whiteCircle.start);
    x = Math.min(x, CONFIG.blueLine.startX);
    doDrawUpper(x);
  };

  const handleInteractionStart = (evt: MouseEvent | TouchEvent) => {
    if ("button" in evt && evt.button !== 0) {
      return;
    }

    const [pageX, pageY] = getEventPosition(evt);
    const [offsetX, offsetY] = stateRef.current.offset;
    const x = (pageX - offsetX) * ratio;
    const y = (pageY - offsetY) * ratio;

    const distanceToCircle = Math.sqrt(
      Math.pow(x - stateRef.current.circleX, 2) +
        Math.pow(y - CONFIG.canvas.halfHeight, 2)
    );

    stateRef.current.isDragging = distanceToCircle <= CONFIG.whiteCircle.radius;
    handleInteractionMove(evt);
    window.addEventListener(isMobile ? "touchend" : "mouseup", handleMouseUp);
  };

  const doDrawUpper = (x: number) => {
    const ctx = upperContextRef.current;
    if (!ctx) {
      return;
    }
    ctx.clearRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);

    const now = Date.now();
    if (now - stateRef.current.t[0] > 100 || x <= stateRef.current.circleX) {
      stateRef.current.t[1] = now;
      stateRef.current.beginX = x;
    }
    stateRef.current.t[0] = now;
    stateRef.current.circleX = x;

    drawUtils.grayLine(ctx);
    drawUtils.blueLine(ctx, CONFIG.blueLine.startX);
    drawUtils.whiteCircle(ctx, x);

    // touch blue line
    if (x >= CONFIG.blueLine.startX) {
      const duration = Date.now() - stateRef.current.t[1];
      let speed =
        (((CONFIG.blueLine.startX - stateRef.current.beginX) / duration) *
          1000) /
        ratio;
      if (isNaN(speed)) {
        speed = 0;
      }
      speed = Math.min(speed, 4500);
      // spped: 0 ~ 5000
      // volume: 20 ~ 100
      const volume = (speed / 4500) * 80 + 20;

      handleMouseUp();
      transitionAnimate();
      setTimeout(() => {
        go(volume);
      }, 400);
    }
  };

  const transitionAnimate = () => {
    const ctx = contextRef.current;
    const upperCtx = upperContextRef.current;
    if (!ctx || !upperCtx) {
      return;
    }

    // white circle movement 0.2s
    const upperTotalFrame = 60 * 0.2;
    let upperFrame = 0;
    const upperAnimate = () => {
      if (upperFrame >= upperTotalFrame) {
        return;
      }
      requestAnimationFrame(upperAnimate);
      ++upperFrame;
      upperCtx.clearRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);

      drawUtils.grayLine(upperCtx);
      drawUtils.blueLine(upperCtx, CONFIG.blueLine.startX);
      drawUtils.whiteCircle(
        upperCtx,
        CONFIG.blueLine.startX + 60 * ratio * (upperFrame / upperTotalFrame)
      );
    };
    // pot image movement 0 ~ 0.2s
    // pot image scale to CONFIG.pot.finalSize 0.2 ~ 0.4s
    // draw white rect 0 ~ 0.4s
    const lowerTotalFrame = 60 * 0.4;
    const halfLowerFrame = lowerTotalFrame * 0.5;
    let lowerFrame = 0;
    const lowerAnimate = () => {
      if (lowerFrame >= lowerTotalFrame) {
        return;
      }
      requestAnimationFrame(lowerAnimate);
      ++lowerFrame;
      ctx.clearRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);

      ctx.save();
      ctx.fillStyle = "#ffffff";
      const h =
        (lowerFrame / lowerTotalFrame) *
        (CONFIG.canvas.height - 2 * CONFIG.whiteRect.padding);
      const y =
        CONFIG.canvas.halfHeight -
        (CONFIG.canvas.halfHeight - CONFIG.whiteRect.padding) *
          (lowerFrame / lowerTotalFrame);
      ctx.fillRect(0, y, CONFIG.canvas.width, h);
      ctx.restore();
      drawUtils.blueLine(ctx, CONFIG.blueLine.startX);

      ctx.save();
      if (lowerFrame <= halfLowerFrame) {
        // pot movement
        const x =
          CONFIG.blueLine.startX -
          CONFIG.whiteCircle.radius +
          60 * ratio * (lowerFrame / halfLowerFrame);
        const y = CONFIG.canvas.halfHeight - CONFIG.whiteCircle.radius;
        const rorateAngel = (lowerFrame / 30) * Math.PI;
        ctx.translate(x + CONFIG.pot.initSize / 2, y + CONFIG.pot.initSize / 2);
        ctx.rotate(rorateAngel);
        ctx.translate(
          -x - CONFIG.pot.initSize / 2,
          -y - CONFIG.pot.initSize / 2
        );
        ctx.drawImage(
          potImageRef.current,
          x,
          y,
          CONFIG.pot.initSize,
          CONFIG.pot.initSize
        );
      } else {
        // pot scale
        const size =
          CONFIG.pot.initSize +
          ((CONFIG.pot.finalSize - CONFIG.pot.initSize) *
            (lowerFrame - halfLowerFrame)) /
            halfLowerFrame;

        const x = CONFIG.blueLine.startX - size / 2 + 60 * ratio;
        const y = CONFIG.canvas.halfHeight - size / 2;
        const rorateAngel = (lowerFrame / 30) * Math.PI;
        ctx.translate(
          CONFIG.blueLine.startX + 60 * ratio,
          CONFIG.canvas.halfHeight
        );
        ctx.rotate(rorateAngel);
        ctx.translate(
          -CONFIG.blueLine.startX - 60 * ratio,
          -CONFIG.canvas.halfHeight
        );
        ctx.drawImage(potImageRef.current, x, y, size, size);
      }
      ctx.restore();
    };

    upperAnimate();
    lowerAnimate();

    // transition 0.4s linear
    const canvas = canvasRef.current;
    const upperCanvas = upperCanvasRef.current;
    canvas!.style.opacity = "1";
    upperCanvas!.style.opacity = "0";
  };

  const go = (finalVolume: number) => {
    const ctx = contextRef.current;
    if (!ctx) {
      return;
    }

    // vt + 1/2 at^2 = distance
    // v + at = 0
    const distance = (CONFIG.blueLine.distance * finalVolume) / 5;
    const t = Math.sqrt((-2 * distance) / a);
    const initSpeed = Math.sqrt(-2 * a * distance);
    let offsetX = 0;
    let rotateAngel = 0.8 * Math.PI;
    let frame = 0;
    const handler = () => {
      if (frame >= 60 * t) {
        const canvas = canvasRef.current;
        const upperCanvas = upperCanvasRef.current;
        canvas!.style.opacity = "0";
        upperCanvas!.style.opacity = "1";
        upperContextRef.current!.clearRect(
          0,
          0,
          CONFIG.canvas.width,
          CONFIG.canvas.height
        );
        stateRef.current.circleX =
          (CONFIG.whiteCircle.start + CONFIG.whiteCircle.end) / 2;
        drawUtils.grayLine(upperContextRef.current!);
        drawUtils.blueLine(upperContextRef.current!, CONFIG.blueLine.startX);
        drawUtils.whiteCircle(
          upperContextRef.current!,
          stateRef.current.circleX
        );
        return;
      }

      requestAnimationFrame(handler);
      ++frame;
      const speed = Math.max(initSpeed + (a * frame) / 60, 0);
      offsetX += speed / 60;
      ac.setVolume(((offsetX / distance) * finalVolume) >> 0);

      ctx.clearRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);
      ctx.save();
      // draw white rect
      ctx.fillStyle = "#ffffff";
      const h = CONFIG.canvas.height - 2 * CONFIG.whiteRect.padding;
      const y = CONFIG.whiteRect.padding;
      ctx.fillRect(0, y, CONFIG.canvas.width, h);
      ctx.restore();

      // draw blue line
      for (let i = 0; i < 21; ++i) {
        const startX =
          i * CONFIG.blueLine.distance + CONFIG.blueLine.startX - offsetX;
        const endX = startX + CONFIG.blueLine.width;
        if (endX <= 0) {
          continue;
        }
        if (startX >= CONFIG.canvas.width) {
          break;
        }

        drawUtils.blueLine(ctx, startX % CONFIG.canvas.width);
      }

      // pot rotate
      ctx.save();
      const rate = Math.min(speed / 200, 1);
      rotateAngel += (Math.PI / 30) * rate;
      ctx.translate(
        CONFIG.blueLine.startX + 60 * ratio,
        CONFIG.canvas.halfHeight
      );
      ctx.rotate(rotateAngel);
      ctx.translate(
        -CONFIG.blueLine.startX - 60 * ratio,
        -CONFIG.canvas.halfHeight
      );
      ctx.drawImage(
        potImageRef.current,
        CONFIG.blueLine.startX - CONFIG.pot.finalSize / 2 + 60 * ratio,
        CONFIG.canvas.halfHeight - CONFIG.pot.finalSize / 2,
        CONFIG.pot.finalSize,
        CONFIG.pot.finalSize
      );
      ctx.restore();
    };

    handler();
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
      upperContextRef.current.clearRect(
        0,
        0,
        CONFIG.canvas.width,
        CONFIG.canvas.height
      );
      drawUtils.grayLine(upperContextRef.current);
      drawUtils.blueLine(upperContextRef.current, CONFIG.blueLine.startX);
      drawUtils.whiteCircle(upperContextRef.current, stateRef.current.circleX);
    }

    const potImage = potImageRef.current;
    potImage.src = potPng;
    potImage.onload = () => {
      console.log("preload pot.png");
    };
  }, []);

  useEffect(() => {
    const volumeEl = document.getElementsByClassName(
      layoutStyles.volume
    )[0] as HTMLDivElement;
    volumeEl.style.transition = "none";
    return () => {
      volumeEl.style.transition = "";
    };
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
    <div className={styles.wrapper}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        width={CONFIG.canvas.width}
        height={CONFIG.canvas.height}
      />
      <canvas
        ref={upperCanvasRef}
        className={classNames(styles.canvas, styles["upper-canvas"])}
        width={CONFIG.canvas.width}
        height={CONFIG.canvas.height}
        onMouseDown={isMobile ? undefined : handleInteractionStart}
        onMouseMove={isMobile ? undefined : handleInteractionMove}
        onTouchStart={isMobile ? handleInteractionStart : undefined}
        onTouchMove={isMobile ? handleInteractionMove : undefined}
      />
    </div>
  );
}

export default Curling;
