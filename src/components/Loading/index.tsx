import { useEffect, useState } from "react";
import styles from "./index.module.css";

interface Props {
  delay?: number;
}

const array = new Array(16).fill(0);

function Loading({ delay = 300 }: Props) {
  const [hide, setHide] = useState(true);

  useEffect(() => {
    setHide(true);
    const id = setTimeout(() => {
      setHide(false);
    }, delay);

    return () => {
      clearTimeout(id);
    };
  }, [delay]);

  if (hide) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.loader}>
        {array.map((_, idx) => (
          <div className={styles.square} key={idx} />
        ))}
      </div>
    </div>
  );
}

export default Loading;
