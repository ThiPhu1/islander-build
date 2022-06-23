import React from "react"
import { useGame } from "src/pages/landing/contexts/gameContextV2";
import Tile from "./tile";
import styles from './styles.module.scss';
import getZ from "src/utils/getZ";

const Row = (props) => {
  const {children} = props || {};

  return (
    <div className={styles['row']}>{children}</div>
  )
}

export default function Grid(props) {
  const {setGrid} = props || {}
  const gridRef = React.useRef();
  const {worldFloor, gridLevel, setGridLevel, selectedElement, mode} = useGame() || {};

  let translateX = -59;
  let translateY = 59;
  if (gridLevel > 0) {
    translateX = translateX / (gridLevel * 2) - worldFloor?.gridLevelOffset;
    translateY = translateY / (gridLevel * 2) + worldFloor?.gridLevelOffset;
  }

  React.useEffect(() => {
    // TODO: Calculate grid size (with rotation)
    const {width, height} = gridRef?.current?.getBoundingClientRect()
    setGrid({width, height});
  }, [gridRef.current, setGrid, worldFloor])

  React.useEffect(() => {
    // TODO: change grid level on selecting element
    // ! on apply action in creative mode
    if (mode!=="create") {return}
    setGridLevel(selectedElement?.gridLevel)
  }, [selectedElement, mode])

  return (
    <div
      ref={gridRef}
      className={`
        ${styles['grid']} 
        ${styles['iso']}
      `}
      style={{
        transformOrigin: "top left",
        transform: `
          rotateX(${worldFloor?.rotateAngle?.x || 54}deg) 
          rotateY(${worldFloor?.rotateAngle?.y || 0}deg) 
          rotateZ(${worldFloor?.rotateAngle?.z || -45}deg) 
          translate(
            calc(${translateX}% + ${worldFloor?.gridOffset?.x ?? 0}px), 
            calc(${translateY}% - ${worldFloor?.gridOffset?.y ?? 0}px)
          )
        `,
      }}
    >
      {Array(worldFloor?.worldSize)
        .fill('x')
        .map((_, rowIndex) => (
          <Row key={rowIndex}>
            {Array(worldFloor?.worldSize)
              .fill('y')
              .map((_, colIndex) => {
                const zIndex = getZ({
                  x: rowIndex,
                  y: colIndex
                })

                return (
                  <Tile
                    key={rowIndex+colIndex}
                    x={rowIndex}
                    y={colIndex}
                    z={zIndex}
                  />
                );
              })
            }
          </Row>
        ))
      }
    </div>
  );
}