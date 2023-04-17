import React, { ReactChildren, useEffect, useRef, useState } from "react";
// import { canUseDOM } from "vtex.render-runtime";

// Styles
import styles from "./styles.css";

interface AccordionProps {
  sectionTitles: Array<SectionTitleObject>
  blockClass: string
  children: ReactChildren | any
  openFirstChild: Boolean
}

interface SectionTitleObject {
  text: string
}

const Accordion: StorefrontFunctionComponent<AccordionProps> = ({ sectionTitles, children, blockClass, openFirstChild }) => {
  const openGate = useRef(true);
  const childRefs = useRef<any>([]);
  const [expandedList, setExpandedList] = useState<Array<Boolean>>(sectionTitles.map(() => false));
  const [childHeight, setChildHeight] = useState<number>(0);

  useEffect(() => {
    if (!openGate.current) return;
    openGate.current = false;

    if (openFirstChild) setFirstToOpen();
  }, []);

  const setFirstToOpen = () => {
    const expandedListTemp = [...expandedList];
    expandedListTemp[0] = true;

    setExpandedList(expandedListTemp);
    setChildHeight(childRefs.current[0].offsetHeight);
  }

  const handleClick = (index: number) => {
    const expandedListTemp = expandedList.map(() => false);
    const isExpanded = expandedList[index];

    if (!isExpanded) expandedListTemp[index] = true;

    setExpandedList(expandedListTemp);
    setChildHeight(childRefs.current[index].offsetHeight);
  }

  const setRef = (element: any, refList: any) => {
    // Conditional prevents filling refLists with null on unmount / remount - LM
    if (refList.length >= sectionTitles.length) return;
    return refList.push(element);
  }

  return (
    <div className={`${styles.container} ${blockClass ? `${styles.container}--${blockClass}` : ``}`}>
      {sectionTitles.map((section, index) => (
        <div key={`wrapper-${index}`}
          className={`${styles.buttonWindowWrapper} ${blockClass ? `${styles.buttonWindowWrapper}--${blockClass}` : ``}`}>
          <button onClick={() => handleClick(index)}
            aria-expanded={expandedList[index] ? "true" : "false"}
            aria-controls={`window-${index}`}
            aria-label={`${section.text}`}
            className={`${styles.button} ${blockClass ? `${styles.button}--${blockClass}` : ``}`}>
            <div className={`${styles.arrow} ${blockClass ? `${styles.arrow}--${blockClass}` : ``}`}>
              ▶
            </div>
            <div className={`${styles.buttonText} ${blockClass ? `${styles.buttonText}--${blockClass}` : ``}`}>
              {section.text}
            </div>
          </button>
          <div id={`window-${index}`}
            aria-hidden={expandedList[index] ? "false" : "true"}
            className={`${styles.window} ${blockClass ? `${styles.window}--${blockClass}` : ``}`}
            style={{ height: expandedList[index] ? `${childHeight}px` : `0px` }}>
            <div ref={(element: any) => setRef(element, childRefs.current)}
              className={`${styles.childWrapper} ${blockClass ? `${styles.childWrapper}--${blockClass}` : ``}`}>
              {children[index]}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

Accordion.schema = {
  title: "Accordion",
  description: "",
  type: "object",
  properties: {
    openFirstChild: {
      title: "Open First Child On Load?",
      type: "boolean"
    },
    sectionTitles: {
      title: "Titles",
      type: "array",
      items: {
        properties: {
          __editorItemTitle: {
            title: "Site Editor Name",
            type: "string"
          },
          text: {
            title: "Text",
            type: "string",
            widget: { "ui:widget": "textarea" }
          }
        }
      }
    }
  }
}

export default Accordion;
