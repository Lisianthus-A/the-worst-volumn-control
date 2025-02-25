import { useLocation } from "wouter";
import styles from "./index.module.css";

function Page404() {
  const [, navigate] = useLocation();

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.emphasis}>404</div>
        <div className={styles.divider}></div>
        <div>page not found</div>
      </div>
      <button onClick={() => navigate("/")}>Back to Home</button>
    </div>
  );
}

export default Page404;
