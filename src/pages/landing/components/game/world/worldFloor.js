import React from "react";
import { useGame } from "src/pages/landing/contexts/gameContextV2";
import styles from './styles.module.scss';

export default function WorldFloor(props) {
  const {targetId, style} = props || {}; 
  const {worldFloor, selectedElement, replaceElement, flushWorld} = useGame();

  React.useEffect(() => {
    // TODO: Clear world's current elements and replace with new floor's default assets
    if (selectedElement?.target === targetId) {
      replaceElement({
        category: "floor",
        targetId,
        element: selectedElement,
      })
      flushWorld()
    }
  }, [selectedElement, replaceElement, targetId, flushWorld]);

  return (
    <div 
      className={styles['world-floor']}
      style={{
        ...style,
        backgroundImage: `url("${worldFloor?.src}")`,
      }}
    ></div>
  )
}