import { useLocation } from "wouter";
import { routes } from "@/routes";
import styles from "./index.module.css";
import type { ChangeEvent } from "react";

function ChooseMusic() {
  const [, navigate] = useLocation();

  const handleFileChange = (evt: ChangeEvent<HTMLInputElement>) => {
    console.log(evt.target.files);
    navigate(routes[1].path);
  };

  const handleUseExample = () => {
    navigate(routes[1].path);
  };

  return (
    <div className={styles.wrapper}>
      <input onChange={handleFileChange} type="file" />
      <div>
        Choose a local music file, or{" "}
        <a href="#" style={{ color: "#1890ff" }} onClick={handleUseExample}>
          use example music
        </a>
      </div>
    </div>
  );
}

export default ChooseMusic;
