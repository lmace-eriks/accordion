import React, { ReactChildren, useEffect, useRef, useState } from "react";
import { canUseDOM } from "vtex.render-runtime";

// Styles
import styles from "./styles.css";

interface AccordionProps {
  mainMenu: Array<string>
  vtexMenuClass: string
  children: ReactChildren | any
}

const Accordion: StorefrontFunctionComponent<AccordionProps> = ({ mainMenu, children, vtexMenuClass }) => {
  const openGate = useRef(true);
  const infoWindow: any = useRef();
  const menuNumber: any = useRef(-1);
  const [activeChild, setActiveChild] = useState<any>();

  useEffect(() => {
    if (!openGate.current) return;
    openGate.current = false;

  }, []);

  const handleClick = (e: any) => {
    const clicked: number = Number(e.currentTarget.dataset.index);
    const button = e.currentTarget;

    if (menuNumber.current === clicked) {
      closeWindow(button);
      return;
    }

    menuNumber.current = clicked;
    setActiveChild(children[clicked]);
    setTimeout(() => { openWindow(button) }, 1);
  }

  const openWindow = (button: any) => {
    if (!canUseDOM) return;

    // Inactivate All Arrows
    const allButtons: any = Array.from(document.querySelectorAll(`.${styles.button}`));
    allButtons.forEach((button: any) => {
      button.setAttribute("aria-expanded", "false");
      button.classList.remove(`${styles.buttonActive}`);
    });

    // Activate Arrow
    button.classList.add(`${styles.buttonActive}`);

    const activeMenuElement: any = document.querySelector(`.${vtexMenuClass}`);
    const activeMenuHeight: number = activeMenuElement.offsetHeight;

    // Set Height
    infoWindow.current.style.height = `${activeMenuHeight}px`;

    // Aria
    button.setAttribute("aria-expanded", "true");
    infoWindow.current.setAttribute("aria-hidden", "false");
  }

  const closeWindow = (button: any) => {
    // Inactivate Arrow
    button.classList.remove(`${styles.buttonActive}`);

    // Reset Height
    infoWindow.current.style.height = `0px`;

    // Reset State
    menuNumber.current = -1;

    // Aria
    button.setAttribute("aria-expanded", "false");
    infoWindow.current.setAttribute("aria-hidden", "true");
  }

  return (<>
    <div className={styles.buttonContainer}>
      {mainMenu.map((item, index) => (
        <button key={index} aria-expanded="false" aria-controls="menu-window" data-index={index} onClick={handleClick} className={styles.button}>
          <div className={styles.arrow}>▶</div>{item}
        </button>
      ))}
    </div>
    <div ref={infoWindow} id="menu-window" aria-hidden="true" aria-live="polite" style={{ height: "0px" }} className={styles.menuContainer}>
      {activeChild}
    </div>
  </>);
}

Accordion.schema = {
  title: "Footer Expand",
  description: "",
  type: "object",
  properties: {

  }
}

export default Accordion;