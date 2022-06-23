import React, { useMemo } from "react";
import { useGame } from "src/pages/landing/contexts/gameContextV2"
import Element from "./element";
import styles from './styles.module.scss';

export default function ElementPlaceholder(props) {
  const {style} = props || {};
  const {selectedElement, currentPos, worldFloor, usedTiles, setValidTile, isValidTile} = useGame() || {};

  const isInRange = (range, tilePos) => {
    // TODO: check if element is in allowed range
    const {x,y} = range || {};
    return (
        tilePos?.x >= x?.start &&
        tilePos?.x <= x?.end
    ) && (
        tilePos?.y >= y?.start &&
        tilePos?.y <= y?.end
    )
  }

  const isOverlap = (pos, isoSize) => {
    // TODO: check if element is overlapping
    // ! Only elements in same grid can be overlapped
    const {x,y} = pos || {};
    for (let i = x; i < x + isoSize?.x; i++) {
      for (let j = y; j < y + isoSize?.y; j++) {
        const isExisted = usedTiles?.find(tile => {
          return (
            tile?.gridLevel===selectedElement?.gridLevel &&
            tile?.x===i && 
            tile?.y===j
          )
        })
        if (isExisted) {
            return true;
        }
      }
    } 
    return false;
  }
  React.useEffect(() => {
    // TODO: validate element at current position
    const pos = currentPos
    const {areas} = worldFloor || {};

    setValidTile((
      !isOverlap(pos, selectedElement?.tileMap?.isoSize) &&
      !areas?.some(area => {
        const firstTilePos = pos
        const lastTilePos = {
          x: pos?.x + selectedElement?.tileMap?.isoSize?.x - 1,
          y: pos?.y + selectedElement?.tileMap?.isoSize?.y - 1
        }
        const range = {
          x: {
              start: area.r,
              end: area.r + area.isoSize?.x - 1
          },
          y: {
              start: area.t,
              end: area.t + area.isoSize?.y - 1
          }
        }
        return (
          selectedElement?.allowedAreas?.includes(area.areaName) && 
          !(
              isInRange(range, firstTilePos) && 
              isInRange(range, lastTilePos)
          )
        )
      })
    ))
  }, [selectedElement, currentPos, worldFloor])

  return (
    <div 
      className={styles['element-placeholder']}
      style={style}
    >
      <Element 
        element={selectedElement} 
        pos={currentPos} 
        hasPlaceholder={true}
        isPlaceable={isValidTile}
      />
    </div>
  ) 
}