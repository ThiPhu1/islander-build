import {ReactComponent as MoveIcon} from "src/common/images/icons/move.svg"
import {ReactComponent as DeleteIcon} from "src/common/images/icons/delete.svg"
import { useGame } from "src/pages/landing/contexts/gameContext"
import styles from "./styles.module.scss"
import { useCallback, useEffect, useMemo, useRef } from "react"

const Toolbox = (props) => {
    const {toolboxPos} = props
    const {
        untargetElement, 
        moveWorldElement, 
        deleteWorldElement, 
        setToolbox, 
        setToolboxPos, 
        worldFloor
    } = useGame()
    const toolboxRef = useRef()
    
    const handleDelete = useCallback(() => {
        deleteWorldElement()
        setToolboxPos(null)
        setToolbox(false)
    }, [deleteWorldElement])
    
    const handleMove = useCallback(() => {
        moveWorldElement()
        setToolboxPos(null)
        setToolbox(false)
    }, [moveWorldElement])

    const toolboxStyle = useMemo(() => {
        
        const {r,t, item} = toolboxPos
        const tileHeight = 100 / (worldFloor?.worldSize + 1)
        const tileWidth = 100 / (worldFloor?.worldSize)
        const bonusRow = item?.tileMap?.isoSize?.x - 1
        
        return {
            bottom: `${tileHeight * ((worldFloor?.worldSize - (r - t + bonusRow) - 1) * 0.5 + 1) + (item?.gridLevel > 0 ? tileHeight * 2 : 0)}%`,
            left: `${tileWidth * (t + r + item?.tileMap?.size - (item?.tileMap?.offset ? item?.tileMap?.offset : 0)) * 0.5 }%`,
        }
    }, [toolboxPos, worldFloor])

    return (
        <div 
            ref={toolboxRef}
            className={styles["toolbox"]}
            style={toolboxStyle}
        >
            <button 
                onClick={handleMove}
                className={styles["btn-move"]}
            >
                <MoveIcon/>
            </button>
            <button 
                onClick={handleDelete}
                className={styles["btn-delete"]}
            >
                <DeleteIcon/>
            </button>
        </div>
    )   
}

export default Toolbox