import { useEffect, useRef } from "react";
import { detectMobile } from "@/utils";
import ac from "@/utils/AudioController";
import { useInterval } from "@/utils/hooks";
import layoutStyles from "@/components/Layout/index.module.css";
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

function InflatorPump() {
  const isMobile = detectMobile();
  const pumpRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    startY: 0,
    prev: 0,
    current: 0,
    score: 0,
  });

  const handleMouseMove = (evt: CustomMoveEvent) => {
    const el = handleRef.current;
    if (!el) {
      return;
    }

    const { prev, current, startY } = stateRef.current;

    let offsetY = prev + evt.clientY - startY;
    offsetY = Math.min(offsetY, 50);
    offsetY = Math.max(offsetY, 0);
    const diff = offsetY - current;
    if (diff > 0) {
      stateRef.current.score += diff;
      if (stateRef.current.score >= 10) {
        // 10 score = 1 volume
        const volumeIncrement = stateRef.current.score / 10;
        stateRef.current.score %= 10;
        const volume = ac.getVolume();
        ac.setVolume(Math.min(volume + volumeIncrement, 100));
      }
    }

    stateRef.current.current = offsetY;

    el.style.setProperty("--offsetY", `${offsetY}px`);
  };

  const handleTouchMove = (evt: globalThis.TouchEvent) => {
    const touch = evt.touches[0];
    handleMouseMove({
      clientX: touch.clientX,
      clientY: touch.clientY,
    });
  };

  const handleMouseUp = () => {
    const el = handleRef.current;
    if (!el) {
      return;
    }

    document.body.style.userSelect = "";
    el.style.cursor = "grab";
    stateRef.current.prev = Number(
      el.style.getPropertyValue("--offsetY").slice(0, -2)
    );

    if (isMobile) {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
  };

  const handleMouseDown = (evt: CustomDownEvent) => {
    if (evt.button !== 0) {
      return;
    }

    const el = handleRef.current;
    if (!el) {
      return;
    }

    stateRef.current.startY = evt.clientY;

    el.style.cursor = "grabbing";
    document.body.style.userSelect = "none";
    if (isMobile) {
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleMouseUp);
    } else {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
  };

  const handleTouchStart = (evt: TouchEvent) => {
    const touch = evt.touches[0];
    handleMouseDown({
      button: 0,
      clientX: touch.clientX,
      clientY: touch.clientY,
    });
  };

  useInterval(() => {
    const volumn = ac.getVolume();
    ac.setVolume(Math.max(volumn - 1, 0));
  }, 200);

  useEffect(() => {
    const el = ac.getElement();
    const onVolumeChange = () => {
      if (!pumpRef.current) {
        return;
      }

      const volume = ac.getVolume();
      pumpRef.current.style.setProperty("--percentage", `${volume}%`);
    };

    el.addEventListener("volumechange", onVolumeChange);
    return () => {
      el.removeEventListener("volumechange", onVolumeChange);
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

  return (
    <div className={styles.pump} ref={pumpRef}>
      <div className={styles.inner} />
      <div
        ref={handleRef}
        className={styles.handle}
        onMouseDown={isMobile ? undefined : handleMouseDown}
        onTouchStart={isMobile ? handleTouchStart : undefined}
      />
    </div>
  );
}

export default InflatorPump;
