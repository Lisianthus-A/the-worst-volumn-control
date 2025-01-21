import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { routes, mapPathToRoute } from "@/routes";
import { Menu } from "@/components";
import classNames from "classnames";
import ac from "@/utils/AudioController";
import { useAppDispatch, useAppSelector } from "@/utils/hooks";
import { markLevelAsFinished } from "@/store/common";
import styles from "./index.module.css";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

function Layout({ children }: Props) {
  const [location, navigate] = useLocation();
  const volumeRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const finishedList = useAppSelector((state) => state.common.finishedList);
  const routeObj = mapPathToRoute.get(location)!;

  const handleComplete = () => {
    const { route, index } = routeObj;
    const aimRange = route.aim.split(",").map(Number);

    const volume = ac.getVolume();
    let isComplete = false;
    if (index === 0) {
      isComplete = ac.getSrc() !== "";
    } else if (aimRange.length === 1 && volume === aimRange[0]) {
      isComplete = true;
    } else if (
      aimRange.length === 2 &&
      volume >= aimRange[0] &&
      volume <= aimRange[1]
    ) {
      isComplete = true;
    }

    if (!isComplete) {
      alert("Not yet completed the aim.");
      return;
    }

    dispatch(markLevelAsFinished(route.name));
  };

  const handleNavigate = (n: number) => {
    const { index } = routeObj;
    ac.setVolume(50);
    navigate(routes[index + n].path);
  };

  useEffect(() => {
    const localFinishedData = localStorage.getItem("twvc-finished");
    if (localFinishedData) {
      dispatch(markLevelAsFinished(localFinishedData.split(",")));
    }

    ac.setVolume(50);
    const el = ac.getElement();
    const onVolumeChange = () => {
      if (!volumeRef.current) {
        return;
      }
      const volume = ac.getVolume();
      volumeRef.current.style.setProperty("--volume", `${volume}`);
    };

    el.addEventListener("volumechange", onVolumeChange);
    return () => {
      el.removeEventListener("volumechange", onVolumeChange);
    };
  }, [dispatch]);

  const { route, index } = routeObj;
  const title = `${index}. ${route.name}`;
  const isComplete = finishedList.indexOf(route.name) >= 0;
  const hasPrev = routes[index - 1] !== undefined;
  const hasNext = routes[index + 1] !== undefined;

  return (
    <div className={styles.layout}>
      <div
        className={classNames(styles.title, "tick", isComplete && "tick-green")}
      >
        <Menu />
        {title}
      </div>
      <div className={styles.aim}>Aim: {route.aimText}</div>
      {index !== 0 && <div className={styles.volume} ref={volumeRef}>Volume:</div>}
      {children}
      <div className={styles.btns}>
        {hasPrev && <button onClick={() => handleNavigate(-1)}>Prev</button>}
        <button onClick={handleComplete} disabled={isComplete}>
          Complete
        </button>
        {hasNext && <button onClick={() => handleNavigate(1)}>Next</button>}
      </div>
    </div>
  );
}

export default Layout;
