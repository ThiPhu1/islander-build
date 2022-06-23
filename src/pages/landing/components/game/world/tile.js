import React from "react";
import { selector } from "recoil";
import { useGame } from "src/pages/landing/contexts/gameContextV2";
import { constants } from "../../old/utils/constants";
import styles from './styles.module.scss';

export default function Tile(props) {
  const {x,y,z} = props;
  const {
    debugging, 
    setPos, 
    placeElementAt, 
    mode, 
    isValidTile, 
    setValidTile,
    selectElement,
    getElementOnTile
  } = useGame() || {};
  const tileRef = React.useRef();

  const allowTileClick = mode!=="view";
  const allowTileHover = mode!=="view";
  const hasBorder = !['view'].includes(mode)
  const onTileClick = () => {
    // TODO: add selected element to world on tile click
    // ! Prevent click event on view mode
    // ! Prevent click event on invalid tiles
    if (!isValidTile) {return}
    placeElementAt({x,y});
    // Set current tile to invalid after placing elements
    setValidTile(false);
  }

  const onTileHover = () => {
    // TODO: send current pos to gameContext on tile hover
    setPos({x,y,z});
    const elementOnTile = getElementOnTile({x,y})
    const allowSelect = mode==="edit" && !elementOnTile?.targetId
    
    return allowSelect && selectElement(elementOnTile)
  }

  return (
    <div
      ref={tileRef}
      className={`
        ${styles['tile']}
        ${debugging ? styles['debugging'] : ""}
        ${hasBorder ? styles["bordered"] : ""}
      `}
      onClick={allowTileClick ? onTileClick : undefined}
      onMouseEnter={allowTileHover ? onTileHover : undefined}
      style={{
        width: constants.TILE_SIZE,
        height: constants.TILE_SIZE
      }}
    >
      {debugging && (
        <h6>
          x: {x} - y: {y} - z: {z}
        </h6>
      )}
    </div>
  )
}