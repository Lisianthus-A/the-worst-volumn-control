import { useRef } from "react";
import classNames from "classnames";
import ac from "@/utils/AudioController";
import styles from "./index.module.css";
import type { ChangeEvent } from "react";

const mapSideTransform: Record<string, string> = {
  0: "translateZ(-40px) rotateX(359deg) rotateY(359deg)",
  1: "translateZ(-40px) rotateX(180deg) rotateY(0deg)",
  2: "translateZ(-40px) rotateX(-90deg) rotateY(0deg)",
  3: "translateZ(-40px) rotateX(0deg) rotateY(-90deg)",
  4: "translateZ(-40px) rotateX(0deg) rotateY(90deg)",
  5: "translateZ(-40px) rotateX(90deg) rotateY(0deg)",
  6: "translateZ(-40px) rotateX(0) rotateY(0)",
};

// animation source: https://codepen.io/askd/pen/WGbOEV
function Dice() {
  const diceRef = useRef<HTMLDivElement>(null);
  const disabledRef = useRef(false);
  const typeRef = useRef("up");

  const handleDiceClick = () => {
    const el = diceRef.current;
    if (!el || disabledRef.current) {
      return;
    }
    disabledRef.current = true;
    const num = (Math.random() * 6 + 1) >> 0;
    el.style.transition =
      "transform 0.4s cubic-bezier(0.55, 0.055, 0.675, 0.19)";
    el.style.transform = mapSideTransform[0];
    setTimeout(() => {
      el.style.transition = "";
      el.style.transform = mapSideTransform[num];
      setTimeout(() => {
        disabledRef.current = false;
        let volume = ac.getVolume() + (typeRef.current === "up" ? num : -num);
        volume = Math.max(0, volume);
        volume = Math.min(100, volume);
        ac.setVolume(volume);
      }, 800);
    }, 400);
  };

  const handleRadioChange = (evt: ChangeEvent<HTMLInputElement>) => {
    if (evt.target.checked) {
      typeRef.current = evt.target.value;
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.desc}>Click to roll the dice</div>
      <div className={styles.dice} ref={diceRef} onClick={handleDiceClick}>
        <div className={classNames(styles.side, styles.side1)}>
          <div className={classNames(styles.point, styles.p5)} />
        </div>
        <div className={classNames(styles.side, styles.side2)}>
          <div className={classNames(styles.point, styles.p1)} />
          <div className={classNames(styles.point, styles.p9)} />
        </div>
        <div className={classNames(styles.side, styles.side3)}>
          <div className={classNames(styles.point, styles.p1)} />
          <div className={classNames(styles.point, styles.p5)} />
          <div className={classNames(styles.point, styles.p9)} />
        </div>
        <div className={classNames(styles.side, styles.side4)}>
          <div className={classNames(styles.point, styles.p1)} />
          <div className={classNames(styles.point, styles.p3)} />
          <div className={classNames(styles.point, styles.p7)} />
          <div className={classNames(styles.point, styles.p9)} />
        </div>
        <div className={classNames(styles.side, styles.side5)}>
          <div className={classNames(styles.point, styles.p1)} />
          <div className={classNames(styles.point, styles.p3)} />
          <div className={classNames(styles.point, styles.p5)} />
          <div className={classNames(styles.point, styles.p7)} />
          <div className={classNames(styles.point, styles.p9)} />
        </div>
        <div className={classNames(styles.side, styles.side6)}>
          <div className={classNames(styles.point, styles.p1)} />
          <div className={classNames(styles.point, styles.p3)} />
          <div className={classNames(styles.point, styles.p4)} />
          <div className={classNames(styles.point, styles.p6)} />
          <div className={classNames(styles.point, styles.p7)} />
          <div className={classNames(styles.point, styles.p9)} />
        </div>
      </div>
      <div>
        <label>
          Up
          <input
            type="radio"
            name="type"
            value="up"
            defaultChecked
            onChange={handleRadioChange}
          />
        </label>
        <label>
          Down
          <input
            type="radio"
            name="type"
            value="down"
            onChange={handleRadioChange}
          />
        </label>
      </div>
    </div>
  );
}

export default Dice;
