import { useEffect, useRef } from "react";
import { detectMobile } from "@/utils";
import ac from "@/utils/AudioController";
import { AudioSvg } from "@/components";
import styles from "./index.module.css";

interface CustomDownEvent {
  button: number;
}

const rotateAnimateDuration = 1000;
const radius = 22;

function Parabola() {
  const isMobile = detectMobile();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<SVGRadialGradientElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const parabolaRef = useRef({
    a: 0,
    runningTime: 0,
    duration: 0,
    start: [0, 0],
    end: [0, 0],
  });
  const clickTime = useRef(0);

  const handleMouseUp = () => {
    const rate = Math.min(
      1,
      (Date.now() - clickTime.current) / rotateAnimateDuration
    );

    document.body.style.userSelect = "";
    clickTime.current = 0;
    if (isMobile) {
      window.removeEventListener("touchend", handleMouseUp);
    } else {
      window.removeEventListener("mouseup", handleMouseUp);
    }

    const wrapper = wrapperRef.current;
    const gradient = gradientRef.current;
    const handle = handleRef.current;
    if (!wrapper || !gradient || !handle) {
      return;
    }

    const startX = Number(
      wrapper.style.getPropertyValue("--offsetX").slice(0, -2)
    );
    const startY = Number(
      wrapper.style.getPropertyValue("--offsetY").slice(0, -2)
    );
    parabolaRef.current.runningTime = Date.now();
    parabolaRef.current.start = [startX, startY];
    parabolaRef.current.end = [-6 + 200 * rate, -3];
    parabolaRef.current.duration = rate * 300 + 80;
    parabolaRef.current.a = 0.012 - rate * 0.008;

    wrapper.style.setProperty("--angle", "0deg");
    gradient.setAttribute("r", "0%");
    handle.style.opacity = "1";
  };

  const handleMouseDown = (evt: CustomDownEvent) => {
    const handle = handleRef.current;
    if (evt.button !== 0 || !handle) {
      return;
    }

    handle.style.opacity = "0";
    document.body.style.userSelect = "none";
    clickTime.current = Date.now();
    if (isMobile) {
      window.addEventListener("touchend", handleMouseUp);
    } else {
      window.addEventListener("mouseup", handleMouseUp);
    }
  };

  const handleTouchStart = () => {
    handleMouseDown({
      button: 0,
    });
  };

  useEffect(() => {
    let id = 0;
    const handler = () => {
      id = requestAnimationFrame(handler);

      const wrapper = wrapperRef.current;
      const gradient = gradientRef.current;
      if (!wrapper || !gradient) {
        return;
      }

      // porabola animate begin

      if (parabolaRef.current.runningTime !== 0) {
        const {
          a,
          runningTime,
          start: [x1, y1],
          end: [x2, y2],
          duration,
        } = parabolaRef.current;

        const rate = Math.min(1, (Date.now() - runningTime) / duration);
        const x = x1 + rate * (x2 - x1);

        // y = ax^2 + bx + c
        const b = (y1 - y2 - a * (x1 * x1 - x2 * x2)) / (x1 - x2);
        const c = y1 - a * x1 * x1 - b * x1;
        const y = a * x * x + b * x + c;
        wrapper.style.setProperty("--offsetX", `${x}px`);
        wrapper.style.setProperty("--offsetY", `${y}px`);

        if (rate >= 1) {
          parabolaRef.current.runningTime = 0;
          ac.setVolume(((x2 + 6) / 2) >> 0);
        }
        return;
      }

      // rotate animate begin

      if (clickTime.current === 0) {
        return;
      }

      const rate = Math.min(
        1,
        (Date.now() - clickTime.current) / rotateAnimateDuration
      );

      const rad = rate * 0.25 * Math.PI;
      wrapper.style.setProperty(
        "--offsetX",
        `${-20 + Math.cos(rad) * radius - radius}px`
      );
      wrapper.style.setProperty(
        "--offsetY",
        `${-3 - Math.sin(rad) * radius}px`
      );
      wrapper.style.setProperty("--angle", `-${rate * 45}deg`);
      gradient.setAttribute("r", `${rate * 100}%`);
    };

    id = requestAnimationFrame(handler);

    return () => {
      cancelAnimationFrame(id);
    };
  }, []);

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <AudioSvg
        className={styles.icon}
        fill="url(#radial-grad)"
        onMouseDown={isMobile ? undefined : handleMouseDown}
        onTouchStart={isMobile ? handleTouchStart : undefined}
      >
        <radialGradient ref={gradientRef} id="radial-grad" cx="0%" r="0%">
          <stop offset="0%" stopColor="#4a95ff" />
          <stop offset="99.99%" stopColor="#4a95ff" />
          <stop offset="100%" stopColor="currentColor" />
        </radialGradient>
      </AudioSvg>
      <div className={styles.bar}>
        <div className={styles.handle} ref={handleRef} />
      </div>
    </div>
  );
}

export default Parabola;
