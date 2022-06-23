import React from 'react';
import { useGame } from 'src/pages/landing/contexts/gameContextV2';
import getZ from 'src/utils/getZ';
import { useToolbox } from '../toolbox';
import styles from './styles.module.scss';

export default function Element(props) {
  const currentGridLevel = useGame()?.gridLevel;
  const {worldFloor, mode, selectedElement, replaceElement} = useGame();
  const {setElementSpec} = useToolbox() || {};
  const {element, pos, hasPlaceholder, isPlaceable, targetId} = props || {};
  const [isTargeted, setTargeted] = React.useState(false); 
  const {x,y} = pos || {};
  const {gridLevel} = element || {};
  const [offsetHeight, setOffsetHeight] = React.useState();
  const imgRef = React.useRef();

  const disabled = mode!=="view" && currentGridLevel!==gridLevel

  const ratioX = element?.tileMap?.isoSize?.x / 2
  const ratioY = element?.tileMap?.isoSize?.y / 2
  
  const offsetX = element?.tileMap?.offset || 0

  const translateX = -100 / element?.tileMap?.size * (0.5 * offsetX);
  const translateY = 100 / element?.tileMap?.height * ((element?.tileMap?.isoSize?.x - 1) * 0.5);

  const elementStyle = {
    left: `${(100 / worldFloor?.worldSize) * ((x+y) * 0.5)}%`,
    bottom: `${(100 / worldFloor?.worldSize) * ((worldFloor?.worldSize - (x-y) - 1) * 0.5 + gridLevel * 2)}%`,
    width: `${(100 / worldFloor?.worldSize) * element?.tileMap?.size}%`,
    height: offsetHeight,
    zIndex: getZ({x,y}) + (gridLevel * 100),
    transform: `translate(${translateX}%, ${translateY}%)`,
    opacity: disabled ? 0.5 : undefined
  }

  const polygonPos = {
    x: {
        top: 100 / element?.tileMap?.size * (ratioY + offsetX / 2),
        right: 100 / element?.tileMap?.size * (ratioX + ratioY + offsetX / 2),
        bottom: 100 / element?.tileMap?.size * (ratioX + offsetX / 2),
        left: 100 / element?.tileMap?.size * offsetX / 2
    },
    y: {
        top: 100 - 100 / element?.tileMap?.height * (ratioX + ratioY),
        right: 100 - 100 / element?.tileMap?.height * ratioY,
        bottom: 100,
        left: 100 - 100 / element?.tileMap?.height * ratioX,
    }
  }

  const adjustHeight = (e) => {
    // TODO: re-calculate element height on image change
    setOffsetHeight(e.currentTarget?.clientHeight)
  }

  React.useEffect(() => {
    if (targetId && selectedElement?.target === targetId) {
      replaceElement({
        category: element?.category,
        targetId,
        element: selectedElement,
      })
    }
  }, [selectedElement, replaceElement, targetId]);

  React.useEffect(() => {
    // TODO: Highlight element on target
    // ! Prevent check tile on placeholder
    if (hasPlaceholder) {return}
    setTargeted(mode==="edit" && selectedElement?.elementId === element?.elementId)
  }, [selectedElement, mode])

  React.useEffect(() => {
    // TODO: calculate toolbox pos for targeted element
    if (isTargeted) {
      setElementSpec({
        isoSize: element?.tileMap?.isoSize,
        pos: {x,y}
      })
    }
  }, [isTargeted])

  return (
    <div 
      className={`
        ${styles['el']}
        ${isTargeted ? styles['targeted'] : ""}
        ${hasPlaceholder ? styles['el--placeholder'] : ""}
      `}
      style={elementStyle}
    >
      {hasPlaceholder && (
        <div 
          className={styles["el__tile"]}
          style={{
            backgroundColor: isPlaceable ? "green" : "red",
            clipPath: `polygon(
                ${polygonPos?.x?.top}% ${polygonPos?.y?.top}%,
                ${polygonPos?.x?.right}% ${polygonPos?.y?.right}%,
                ${polygonPos?.x?.bottom}% ${polygonPos?.y?.bottom}%,
                ${polygonPos?.x?.left}% ${polygonPos?.y?.left}%
            )`
          }}
        ></div>
      )}
      <img
        ref={imgRef} 
        src={element?.src} 
        alt=""
        onLoad={adjustHeight}
      />
    </div>
  )
}