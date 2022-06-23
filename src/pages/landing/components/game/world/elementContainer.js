import styles from './styles.module.scss';

import { useGame } from "src/pages/landing/contexts/gameContextV2"
import Element from "./element";

export default function ElementContainer(props) {
  const {style} = props || {} ;
  const {worldElements} = useGame() || {};
  return (
    <div 
      className={styles['element-container']}
      style={style}
    >
      {worldElements?.map((e, index) => (
        <Element
          key={`${e?.elementId}.${index}`}
          element={e}
          pos={e?.pos}
          targetId={e?.targetId}
        />
      ))} 
    </div>
  )
}