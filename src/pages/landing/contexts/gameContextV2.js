import react from "react";
import { getItemFromDb } from "src/utils/getItemFromDb";
import { useGameHistory } from "./historyContext";

const gameContext = react.createContext();

export const useGame = () => react.useContext(gameContext);

export const GameProvider = (props) => {
  const {children, debug} = props || {}
  const {pointer, isTravelling, saveRecordToHistory, getRecordFromHistory, setTravelling} = useGameHistory();
  
  const didLoad = react.useRef(false);
  const [needSave, triggerSave] = react.useState(false);

  const [mode, setMode] = react.useState('view');
  const [selectedElement, selectElement] = react.useState();
  const [worldBg, setWorldBg] = react.useState();
  const [worldElements, setWorldElements] = react.useState([]);
  const [worldFloor, setWorldFloor] = react.useState();
  const [gridLevel, setGridLevel] = react.useState(+0);
  const [currentPos, setPos] = react.useState({x: 0, y: 0})
  const [isValidTile, setValidTile] = react.useState(true);
  const [usedTiles, setUsedTiles] = react.useState([]);

  const useTiles = () => {
    // TODO: calculate tiles used by elements
    const tiles = []
    worldElements?.map(element => {
      const {tileMap} = element || {};
      for (let i=element?.pos?.x; i<element?.pos?.x + tileMap?.isoSize?.x; i++) {
        for (let j=element?.pos?.y; j<element?.pos?.y + tileMap?.isoSize?.y; j++) {
          tiles.push({
            x: i, 
            y: j, 
            elementId: element?.elementId, 
            code: element?.code,
            isDefault: element?.targetId ? true : false,
            gridLevel: element?.gridLevel
          })
        }
      }
    })

    setUsedTiles(tiles);
  }

  const deleteElement = () => {
    // TODO: delete selected element from world
    setWorldElements((oldWorld) => {
      return oldWorld.filter(element => selectedElement?.elementId !== element?.elementId)
    })
    setTravelling(false)
  }

  const replaceElement = react.useCallback((data) => {
    // TODO: Replace target element with new selected one
    const {category, targetId, element} = data || {};

    switch (category) {
      case "floor": 
        setWorldFloor(element);
        break;
      case "background":
        setWorldBg(element);
        break;
      default: 
        setWorldElements((oldWorld) => {
          return oldWorld?.map((oldElement) => {
            let newElement = oldElement;

            if (oldElement?.targetId === targetId) {
              newElement = {
                ...oldElement,
                src: element?.src,
                code: element?.code,
                id: element?.id,
                item: element?.item,
                tileMap: element?.tileMap
              }
            }
            return newElement;
          })
        })
      setTravelling(false)
    }
  }, [])

  const placeElementAt = (pos) => {
    // TODO: generate element object and append to current worldElements
    const elementObj = {
      ...selectedElement,
      pos,
      elementId: selectedElement?.elementId || worldElements.length
    }
    setWorldElements((oldWorld) => [...oldWorld, elementObj]);

    // TODO: return to edit mode after moving element
    if (mode==="move") {
      setMode("edit")
    }

    // TODO: Change history travelling on action
    setTravelling(false)
  }

  const flushWorld = react.useCallback(() => {
    setWorldElements([]);
  }, [])

  const getFloorDefaultElement = () => {
    const elements = worldFloor?.defaultObjects?.map?.(e => ({
      ...getItemFromDb({category: e?.category, code: e?.code}),
      category: e?.category,
      targetId: e?.targetId,
      pos: {
        x: e?.pos?.r,
        y: e?.pos?.t,
      }
    }))
    setWorldElements(elements);
  }

  const saveWorld = () => {
    triggerSave(true);
  }

  const loadWorld = ({init, fromHistoryRecord} = {}) => {
    // TODO: restore world from db
    let savedObj;
    let floor;
    let bg; 
    let elements;
    
    if (!init) {
      // TODO: load elements of old world stored in db
      // * Load elements of old world stored in history
      try {
        savedObj = fromHistoryRecord || JSON.parse(localStorage.getItem("savedWorld"));

        // Load db data using element's category and code
        floor = getItemFromDb({category: 'floor', code: savedObj?.floor?.code});
        bg = getItemFromDb({category: 'background', code: savedObj?.background?.code})
        elements = savedObj?.elements?.map?.((e, index) => ({
          ...getItemFromDb({category: e?.category, code: e?.code}),
          pos: e?.pos,
          targetId: e?.targetId,
          elementId: index
        }))
      }
      catch(err) {
        savedObj = null
        
        floor = null; 
        bg = null; 
        elements = null;
      }
  
      if (!floor && !bg && !elements) {
        return false;
      }
    }
    else {
      console.log("%cNo island found! LOADING DEFAULT ISLAND...", "font-size: 1rem; color: red");
      // TODO: load default elements for floor
      floor = getItemFromDb({category: 'floor', code: "floor_7x7"});
      elements = floor?.defaultObjects?.map?.((e, index) => ({
        ...getItemFromDb({category: e?.category, code: e?.code}),
        targetId: e?.targetId,
        elementId: index,
        pos: {
          x: e?.pos?.r,
          y: e?.pos?.t,
        }
      }))
    }

    setWorldFloor(floor);
    setWorldBg(bg);
    setWorldElements(elements); 
    return true;
  }

  const getElementOnTile = (pos) => {
    // TODO: get element existed on tile 
    const {elementId} = usedTiles?.find(tile => (
      tile?.x === pos?.x && 
      tile?.y === pos?.y &&
      tile?.gridLevel === gridLevel
    )) || {};
    return worldElements?.find(element => element?.elementId === elementId);
  }

  react.useLayoutEffect(() => {
    if (!didLoad?.current) {
      console.log("%cLOADING ISLAND...", "font-size: 2rem; color: yellow");
      // TODO: load old world from db on init
      // ! If old world not loaded, load default world
      if (!loadWorld()) {
        loadWorld({init: true});
        saveWorld();
      }

      didLoad.current = true;
    }
  }, [])

  react.useEffect(() => {
    if (worldFloor && worldElements?.length < 1) {
      getFloorDefaultElement();
    }
  }, [worldFloor])

  react.useEffect(() => {
    console.log({worldFloor, worldBg, worldElements})
    // TODO: save world on change
    const allowSave = (
      // ! Only save world in view, create mode
      ["create", "view"].includes(mode)
    );
    return allowSave && saveWorld();
  }, [worldFloor, worldBg, worldElements])

  react.useEffect(() => {
    // TODO: calculate used tiles on world change
    useTiles(); 
  }, [worldElements])

  react.useEffect(() => {
    // TODO: save current world to db
    if (needSave) {
      const saveableObj = {
        background: {code: worldBg?.code}, 
        floor: {code: worldFloor?.code},
        elements: worldElements?.map(element => ({
          targetId: element?.targetId,
          category: element?.category,
          code: element?.code,
          pos: element?.pos
        })),
        savedAt: Date.now() 
      }
      localStorage.setItem("savedWorld", JSON.stringify(saveableObj))
      // ! Only save world record in present
      if (!isTravelling) {
        saveRecordToHistory(saveableObj)
      }
      
      console.log("%cWorld saved to db", "color: cyan")
      triggerSave(false); // Set save mode off right after saving
    }
  }, [needSave])

  react.useLayoutEffect(() => {
    switch (mode) {
      case "view":
        selectElement(null);
        setGridLevel(0);  
        break;
      case "edit":
        break;
      case "create": 
        break;
      case "move":
        break;
    }
  }, [mode]);

  react.useEffect(() => {
    // TODO: load world in history at pointer
    if (!isTravelling) {return}

    const worldRecord = getRecordFromHistory();
    if (worldRecord) {
      loadWorld({fromHistoryRecord: worldRecord})
    }
  }, [pointer])

  return (
    <gameContext.Provider value={{
      debugging: debug,
      mode, setMode,
      selectedElement, selectElement,
      isValidTile, setValidTile,
      worldBg,
      worldElements, 
      worldFloor,
      placeElementAt,
      gridLevel, setGridLevel,
      currentPos, setPos,
      usedTiles,
      replaceElement, deleteElement,
      saveWorld, loadWorld, flushWorld, 
      getElementOnTile
    }}>
      {children}
    </gameContext.Provider>
  )
}