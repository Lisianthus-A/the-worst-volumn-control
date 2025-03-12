import { useEffect, useState } from "react";
import classNames from "classnames";
import { randomString } from "@/utils";
import ac from "@/utils/AudioController";
import layoutStyles from "@/components/Layout/index.module.css";
import styles from "./index.module.css";

const precisionPi =
  "14159265358979323846264338327950288419716939937510582097494459230781640628620899862803482534211706798214808651328230664709384460955058223172535940812848111745028410270193852110555964462294895493038196";

const piCharacters = precisionPi.split("").map((value, index) => ({
  id: randomString(),
  value,
  index,
}));

const sliceSize = 10;

function Pi() {
  const [index, setIndex] = useState(0);
  const num = precisionPi.slice(index, index + 2);
  ac.setVolume(Number(num));

  useEffect(() => {
    const onKeydown = (evt: KeyboardEvent) => {
      if (evt.key === "ArrowLeft") {
        setIndex((v) => Math.max(0, v - 1));
      } else if (evt.key === "ArrowRight") {
        setIndex((v) => Math.min(piCharacters.length - 2, v + 1));
      }
    };

    document.addEventListener("keydown", onKeydown);
    return () => {
      document.removeEventListener("keydown", onKeydown);
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

  let start = Math.max(0, index - 4);
  if (start + sliceSize > piCharacters.length) {
    start -= start + sliceSize - piCharacters.length;
  }
  const characterSlice = piCharacters.slice(start, start + sliceSize);

  return (
    <>
      <div className={styles.wrapper}>
        <span className={styles.weaken}>π = 3.</span>
        <span className={classNames(styles.weaken, start <= 0 && styles.hide)}>
          ...
        </span>
        {characterSlice.map((item) => (
          <span
            key={item.id}
            className={classNames(
              styles.num,
              [index, index + 1].indexOf(item.index) >= 0 &&
                styles["num-active"]
            )}
          >
            {item.value}
          </span>
        ))}
        <span
          className={classNames(
            styles.weaken,
            start + sliceSize < piCharacters.length && styles.hide
          )}
        >
          ...
        </span>
      </div>
      <div className={styles.btns}>
        <button onClick={() => setIndex((v) => Math.max(0, v - 1))}>←</button>
        <button
          onClick={() =>
            setIndex((v) => Math.min(piCharacters.length - 2, v + 1))
          }
        >
          →
        </button>
      </div>
    </>
  );
}

export default Pi;
