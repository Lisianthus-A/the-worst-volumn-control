import { useRef } from "react";
import { Link, useLocation } from "wouter";
import classNames from "classnames";
import { Portal } from "@/components";
import { routes } from "@/routes";
import { useAppSelector } from "@/utils/hooks";
import ac from "@/utils/AudioController";
import styles from "./index.module.css";

function Menu() {
  const finishedList = useAppSelector((state) => state.common.finishedList);
  const checkboxRef = useRef<HTMLInputElement>(null);
  const [location] = useLocation();

  const handleClickLink = () => {
    const checkbox = checkboxRef.current;
    if (!checkbox || !checkbox.checked) {
      return;
    }

    checkbox.click();
    ac.setVolume(50);
  };

  return (
    <label className={styles.menu} htmlFor="menu-checkbox">
      <svg
        className={styles.icon}
        viewBox="0 0 1024 1024"
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        fill="currentColor"
      >
        <path d="M170.666667 298.666667a42.666667 42.666667 0 0 1 42.666666-42.666667h597.333334a42.666667 42.666667 0 1 1 0 85.333333H213.333333a42.666667 42.666667 0 0 1-42.666666-42.666666z m0 213.333333a42.666667 42.666667 0 0 1 42.666666-42.666667h597.333334a42.666667 42.666667 0 1 1 0 85.333334H213.333333a42.666667 42.666667 0 0 1-42.666666-42.666667z m0 213.333333a42.666667 42.666667 0 0 1 42.666666-42.666666h597.333334a42.666667 42.666667 0 1 1 0 85.333333H213.333333a42.666667 42.666667 0 0 1-42.666666-42.666667z" />
      </svg>
      <Portal>
        <input
          id="menu-checkbox"
          ref={checkboxRef}
          type="checkbox"
          className={styles.checkbox}
          hidden
        />
        <label className={styles.mask} htmlFor="menu-checkbox">
          <div
            className={styles.drawer}
            onClick={(evt) => evt.preventDefault()}
          >
            <div className={styles["link-list"]}>
              {routes.map((route, index) => {
                const isActive = location === route.path;
                const isComplete = finishedList.indexOf(route.name) >= 0;
                const title = `${index + 1}. ${route.name}`;

                return (
                  <Link
                    className={classNames(
                      styles.link,
                      isActive && styles["link-active"],
                      "tick",
                      isComplete && "tick-green"
                    )}
                    key={route.name}
                    href={route.path}
                    onClick={handleClickLink}
                  >
                    {title}
                  </Link>
                );
              })}
            </div>
          </div>
        </label>
      </Portal>
    </label>
  );
}

export default Menu;
