import React from "react";
import { useGame } from "src/pages/landing/contexts/gameContextV2";
import styles from './styles.module.scss';

export default function WorldBackground(props) {
  const {targetId} = props || {}; 
  const {worldBg, selectedElement, replaceElement} = useGame();

  React.useEffect(() => {
    if (selectedElement?.target === targetId) {
      replaceElement({
        category: "background",
        targetId,
        element: selectedElement,
      })
    }
  }, [selectedElement, replaceElement, targetId]);

  return (
    <div
      className={styles['world-bg']}
      style={{
        backgroundImage: `url(${worldBg?.src})`
      }}
    ></div>
  )
}