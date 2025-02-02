import { useEffect, useRef } from "react";
import ac from "@/utils/AudioController";
import sampleMp3 from "./sample.mp3";
import styles from "./index.module.css";
import type { ChangeEvent } from "react";

function ChooseMusic() {
  const urlRef = useRef("");

  const handleFileChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const files = evt.target.files || [];
    const file = files[0];
    if (!file) {
      return;
    }
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
    }
    urlRef.current = URL.createObjectURL(file);
    ac.setSrc(urlRef.current);
    ac.play();
  };

  const handleUseSample = () => {
    ac.setSrc(sampleMp3);
    ac.play();
  };

  useEffect(() => {
    const u = urlRef.current;
    if (u) {
      return () => URL.revokeObjectURL(u);
    }
  }, []);

  return (
    <div className={styles.wrapper}>
      <div>
        <div className={styles["button-link"]}>
          choose
          <input
            className={styles.hide}
            onChange={handleFileChange}
            type="file"
            accept="audio/*"
          />
        </div>{" "}
        a local music to play,
      </div>
      <div>
        or{" "}
        <div className={styles["button-link"]} onClick={handleUseSample}>
          use the sample music
        </div>
      </div>
    </div>
  );
}

export default ChooseMusic;
