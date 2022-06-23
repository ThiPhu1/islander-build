import React from "react"
import {ReactComponent as MoveIcon} from "src/common/images/icons/move.svg"
import {ReactComponent as DeleteIcon} from "src/common/images/icons/delete.svg"
import { useGame } from "src/pages/landing/contexts/gameContextV2";
import styles from './styles.module.scss'

const toolboxContext = React.createContext();

export const useToolbox = () => React.useContext(toolboxContext);

export const ToolboxProvider = (props) => {
  const {children} = props || {};
  const {mode, selectedElement, worldFloor, gridLevel} = useGame() || {};
  // const [hasToolbox, triggerToolbox] = React.useState(false);
  const hasToolbox = mode==="edit" && !!selectedElement;
  const [elementSpec, setElementSpec] = React.useState();

  // TODO: Calculate toolbox pos
  const {pos, isoSize} = elementSpec || {};
  const gridOffsetLeftByPx = worldFloor?.domOffset?.x ?? 0
  const gridOffsetBottomByTiles = 1
  // The bottom distance between each row = 0.5
  // The bottom value is affected by the col pos. Higher col order -> bigger bottom value
  // The bottom value is affected by element's isoSize (toolboxOffset)
  // The bottom value is affected by element's gridLevel
  const bottomPosByTiles = (worldFloor?.worldSize - 1) - pos?.x + pos?.y
  // ! Prevent toolbox pos is too low -> conflict with other tiles -> hard to hover 
  const toolboxOffsetY = isoSize?.x / 2 - 0.5 - (isoSize?.y===1 || isoSize?.x === isoSize?.y ? 0 : 0.5)
  const actualBottomPos = gridOffsetBottomByTiles + bottomPosByTiles * 0.5 - toolboxOffsetY + gridLevel * 2

  // The left distance between each col = 0.5
  // The left value is affected by the row pos. Higher row order -> bigger left value
  const actualWidth = (isoSize?.x + isoSize?.y) * 0.5
  const toolboxOffsetX = isoSize?.x===1 || isoSize?.x === isoSize?.y ?  0 : isoSize?.y / 2 * 0.25
  const actualLeftPos = (pos?.y + pos?.x) * 0.5 + actualWidth * 0.5 + toolboxOffsetX

  const toolboxStyle = {
    // bottom = Height of a tile (by %) * actualBottomPos
    bottom: `${100 / (worldFloor?.worldSize + gridOffsetBottomByTiles) * actualBottomPos}%`,
    // left = Width of a tile (by %, without gridOffsetLeft) * actualLeftPos
    left: `calc(${gridOffsetLeftByPx}px + (100% - ${gridOffsetLeftByPx}px) / ${worldFloor?.worldSize} * ${actualLeftPos})`
  }

  return (
    <toolboxContext.Provider value={{
      setElementSpec
    }}>
      {children}
      {hasToolbox && <Toolbox style={toolboxStyle}/>}
    </toolboxContext.Provider>
  )
}

export const Toolbox = (props) => {
  const toolboxRef = React.useRef();
  const {style} = props || {};
  const {deleteElement, setMode, selectElement} = useGame();

  const onMove = () => {
    console.log("MOVING...")
    // TODO: handle event on element move action
    setMode("move");
    // Delete targeted element for moving
    deleteElement();
  }

  const onDelete = () => {
    console.log("DELETING...")
    // TODO: handle event on element removal
    deleteElement();
    selectElement(null);
  }

  return (
    <div 
      ref={toolboxRef}
      className={styles["toolbox"]}
      style={style}
    >
      <button 
        onClick={onMove}
        className={styles["btn-move"]}
      >
        <MoveIcon/>
      </button>
      <button 
        onClick={onDelete}
        className={styles["btn-delete"]}
      >
        <DeleteIcon/>
      </button>
    </div>
  )  
}