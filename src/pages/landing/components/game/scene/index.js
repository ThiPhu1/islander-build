import React from "react";
import { useGame } from "src/pages/landing/contexts/gameContextV2";
import World from "../world";
import BottomMenu from "./bottomMenu";
import styles from './styles.module.scss';
import TopMenu from "./topMenu";
import WorldBackground from "./worldBg";

export default function Scene() {
  const {mode} = useGame() || {};
  const sceneRef = React.useRef()
  const [isFullscreen, setFullscreen] = React.useState(false)

  React.useEffect(() => {
    // TODO: handle fullscreen
    if (isFullscreen) {
      sceneRef?.current.requestFullscreen?.();
    }
    else {
      if (document?.fullscreenElement) {
        document?.exitFullscreen?.();
      }
    }
  }, [isFullscreen])

  return (
    <div className={styles['scene']} ref={sceneRef}>
      <TopMenu toggleFullscreen={() => setFullscreen(!isFullscreen)}/>
      <WorldBackground targetId="background"/>
      <World isFullscreen={isFullscreen}/>
      {mode==="edit" && <BottomMenu/>}
    </div>
  )
}