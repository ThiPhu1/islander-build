import React from 'react';
import { useGame } from 'src/pages/landing/contexts/gameContextV2';
import styles from './styles.module.scss'

export default function BottomMenu () {
  const [didSave, setSave] = React.useState(false);
  const hasChanges = React.useRef(false);
  const {loadWorld, setMode, saveWorld, worldElements, selectElement} = useGame();
  const oldWorldElements = React.useMemo(() => [...worldElements], []);

  const onExit = (e) => {
    // TODO: load old world in db on exit and switch back to view mode
    if (hasChanges.current) {
      loadWorld();
    }
    setMode("view");
  }

  const onSave = (e) => {
    // TODO: save current change to db on save and return to view mode
    // ! Prevent save action without any changes
    if (hasChanges.current) {
      saveWorld();
      setSave(true);
      setTimeout(() => {
        setSave(false);
        setMode("view");
      }, 2000)
    }
    else {
      setMode("view");
    }

  }

  React.useEffect(() => {
    if (oldWorldElements !== worldElements) {
      hasChanges.current = true;
    }
  }, [worldElements])

  return (
    <div className={styles["btn-group-bottom"]}>
      {!didSave && (
        <button 
          className={styles["btn-cancel"]}
          onClick={onExit}
        >Cancel</button>
      )}
      <button 
        className={styles["btn-save"]} 
        onClick={onSave} 
        disabled={didSave}
      >{didSave ? "Saved!" : "Save"}</button>
    </div>
  )
}