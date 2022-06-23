import React from "react";
import { useGame } from "src/pages/landing/contexts/gameContextV2";
import { ToolboxProvider } from "../toolbox";
import ElementContainer from "./elementContainer";
import ElementPlaceholder from "./elementPlaceholder";
import Grid from "./grid";
import styles from './styles.module.scss';
import WorldFloor from "./worldFloor";

export default function World(props) {
  const {isFullscreen} = props || {}
  const {mode, worldFloor} = useGame() || {};
  const hasPlaceholder = ["create", "move"].includes(mode);
  const [grid, setGrid] = React.useState({
    width: 0, 
    height: 0
  });

  const worldStyle = {
    width: grid?.width + (worldFloor?.gridOffset?.x ?? 0),
    height: grid?.height + (grid?.height / (worldFloor?.worldSize ?? 1)),
  }

  const containerStyle = {
    width: grid?.width,
    height: grid?.height,
    left: `${worldFloor?.domOffset?.x ?? 0}px`,
    bottom: `${grid?.height / worldFloor?.worldSize - (worldFloor?.domOffset?.y ?? 0)}px`
  }

  const toolboxStyle = {
    width: grid?.width,
    height: grid?.height,
  }

  return (
    <div 
      className={`
        ${styles['world']}
        ${styles['fullscreen']}
      `}
    >
      <ToolboxProvider style={toolboxStyle}>
        <WorldFloor targetId="floor" style={worldStyle}/>
        <ElementContainer style={containerStyle} />
        {hasPlaceholder && <ElementPlaceholder style={containerStyle}/>}
        <Grid setGrid={setGrid}/>
      </ToolboxProvider>
    </div>
  )
}