import { useEffect, useRef } from "react";
import ac from "@/utils/AudioController";
import styles from "./index.module.css";
import type { TouchEvent } from "react";

interface CustomDownEvent {
  button: number;
  clientX: number;
  clientY: number;
}

interface CustomMoveEvent {
  clientX: number;
  clientY: number;
}

const acceleration = 0.5;
const friction = 0.05;
const trackWidth = 180;

function InclinedPlaceAndBall() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<HTMLDivElement>(null);
  const centerPointRef = useRef({ x: 0, y: 0 });
  const isEndingRef = useRef(false);
  const isFromLeftRef = useRef(false);
  const slopeRef = useRef(0);
  const velocityRef = useRef(0);
  const valueRef = useRef(50);

  const handleMouseMove = (evt: CustomMoveEvent) => {
    const el = controllerRef.current;
    if (!el) {
      return;
    }
    const { x, y } = centerPointRef.current;
    const k = (evt.clientY - y) / (evt.clientX - x);

    const isReverse =
      (isFromLeftRef.current && evt.clientX > x) ||
      (!isFromLeftRef.current && evt.clientX < x);
    const deg = Math.atan(k) + (isReverse ? Math.PI : 0);

    slopeRef.current = isReverse ? -k : k;
    el.style.transform = `rotate(${deg}rad)`;
  };

  const handleTouchMove = (evt: globalThis.TouchEvent) => {
    evt.preventDefault();
    const touch = evt.touches[0];
    handleMouseMove({
      clientX: touch.clientX,
      clientY: touch.clientY,
    });
  };

  const handleMouseUp = () => {
    const el = controllerRef.current;
    if (!el) {
      return;
    }

    document.body.style.userSelect = "";
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
    window.removeEventListener("touchmove", handleTouchMove);
    window.removeEventListener("touchend", handleMouseUp);

    isEndingRef.current = true;
    slopeRef.current = 0;
    velocityRef.current = 0;
    el.style.cursor = "default";
    el.style.transition = "transform 0.4s ease-in-out";
    el.style.transform = "rotate(0)";
    setTimeout(() => {
      el.style.cursor = "grab";
      el.style.transition = "";
      isEndingRef.current = false;
    }, 400);
  };

  const handleMouseDown = (evt: CustomDownEvent) => {
    if (evt.button !== 0 || isEndingRef.current) {
      return;
    }

    const el = controllerRef.current;
    if (!el) {
      return;
    }

    isFromLeftRef.current = evt.clientX < centerPointRef.current.x;
    el.style.cursor = "grabbing";
    document.body.style.userSelect = "none";
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleMouseUp);
  };

  const handleTouchStart = (evt: TouchEvent) => {
    evt.preventDefault();
    const touch = evt.touches[0];
    handleMouseDown({
      button: 0,
      clientX: touch.clientX,
      clientY: touch.clientY,
    });
  };

  useEffect(() => {
    const el = controllerRef.current;
    if (!el) {
      return;
    }

    const onResize = () => {
      const rect = el.getBoundingClientRect();
      centerPointRef.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    };

    onResize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    let id = 0;
    const handler = () => {
      id = requestAnimationFrame(handler);
      if (slopeRef.current === 0) {
        return;
      }

      velocityRef.current += acceleration * slopeRef.current;
      if (velocityRef.current > 0) {
        velocityRef.current -= friction;
        velocityRef.current = Math.max(0, velocityRef.current);
      } else {
        velocityRef.current += friction;
        velocityRef.current = Math.min(0, velocityRef.current);
      }

      const el = wrapperRef.current;
      if (!el) {
        return;
      }

      valueRef.current += velocityRef.current;
      if (valueRef.current < 0) {
        valueRef.current = 0;
        velocityRef.current = 0;
      } else if (valueRef.current > 100) {
        valueRef.current = 100;
        velocityRef.current = 0;
      }

      const offset = (valueRef.current / 100) * trackWidth - 6;
      el.style.setProperty("--offset", `${offset}px`);
      ac.setVolumn(valueRef.current >> 0);
    };

    id = requestAnimationFrame(handler);

    return () => {
      cancelAnimationFrame(id);
    };
  }, []);

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <div
        className={styles.controller}
        ref={controllerRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className={styles.track}>
          <div className={styles.rail} />
        </div>
      </div>
    </div>
  );
}

export default InclinedPlaceAndBall;
