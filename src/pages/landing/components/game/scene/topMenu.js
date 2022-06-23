import React from 'react'
import styles from './styles.module.scss'
import {ReactComponent as PencilIcon} from "src/common/images/icons/edit.svg"
import {ReactComponent as ArrowUp} from "src/common/images/icons/arrow-up.svg"
import {ReactComponent as ArrowDown} from "src/common/images/icons/arrow-down.svg"
import {ReactComponent as ArrowRight} from "src/common/images/icons/arrow-r.svg"
import {ReactComponent as ArrowLeft} from "src/common/images/icons/arrow-l.svg"
import {ReactComponent as Exit} from "src/common/images/icons/exit.svg"
import {ReactComponent as Eye} from "src/common/images/icons/eye.svg"
import { useGame } from 'src/pages/landing/contexts/gameContextV2'
import { useGameHistory } from 'src/pages/landing/contexts/historyContext'

export default function TopMenu(props) {
  const {toggleFullscreen} = props || {};
  const {mode, gridLevel, setGridLevel, setMode, selectElement} = useGame();
  const {worldHistory, pointer, goTo} = useGameHistory();
  const allowChangeGridLevel = ["edit"].includes(mode);
  const allowEdit = ["view"].includes(mode)
  const allowExit = ["create"].includes(mode)
  const allowRickRoll = ["view", "create"].includes(mode)
  const allowFullscreen = ["view"].includes(mode)  

  const onEdit = (e) => {
    // TODO: trigger edit mode
    setMode("edit");
  }

  const onExit = (e) => {
    // TODO: return to view mode
    setMode("view");
  }

  const goToGrid = (direction) => {
    // TODO: adjust grid level and unselect current element
    setGridLevel((currentGridLevel) => currentGridLevel + direction)
    selectElement(null);
  }

  return (
    <div className={styles["btn-group-top"]}>
      {allowRickRoll && (
        <>
          <button 
            disabled={worldHistory?.length+pointer <= 1}
            onClick={() => goTo(-1)}
          >
            <ArrowLeft/>
          </button>
          <button 
            disabled={worldHistory?.length+pointer >= worldHistory?.length}
            onClick={() => goTo(+1)}
          >
            <ArrowRight/>
          </button>
        </>
      )}
      {allowEdit && (
        <button 
          onClick={onEdit}
        >
          <PencilIcon/>
        </button>
      )}
      {allowFullscreen && (
        <button 
          onClick={toggleFullscreen}
        >
          <Eye/>
        </button>
      )}
      {
        allowChangeGridLevel && (
        <>
          <button 
            disabled={gridLevel>0} 
            onClick={() => goToGrid(+1)}
          >
            <ArrowUp/>
          </button>
          <button 
            disabled={gridLevel<1} 
            onClick={() => goToGrid(-1)}
          >
            <ArrowDown/>
          </button>
        </>
      )}
      {allowExit && (
        <button 
          onClick={onExit}
        >
          <Exit/>
        </button>
      )}
    </div>
  )
}