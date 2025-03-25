import { useRef } from "react";
import { Link, useLocation } from "wouter";
import classNames from "classnames";
import { Portal, MenuSvg } from "@/components";
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
      <MenuSvg className={styles.icon} />
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
                const title = `${index}. ${route.name}`;

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
