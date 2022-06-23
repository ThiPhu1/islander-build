import React, { useCallback, useEffect, useState } from 'react';
import { items } from '../db';

const GameContext = React.createContext();
export const GameProvider = (props) => {
    const [defaultElement, setDefaultElement] = useState(null)
    const [needRestore, setRestore] = React.useState(false)
    const [needSave, setSave] = React.useState(false)
    const [didLoad, setLoad] = React.useState(false)
    const isInit = React.useRef(false)
    // Current selected block's object
    const [placeObj, setPlaceObj] = React.useState();
    // Toggle block to follow along cursor
    const [builderStatus, setBuilderStatus] = React.useState(false);
    // Toggle on non-unique block pos
    const [builderErrorStatus, setBuilderErrorStatus] = React.useState(false);
    // Array contains current blocks placed on plate
    const [worldDb, setWorldDb] = React.useState([]);
    // Array contains placed block's pos on plate
    const [listOfTileExisted, setListOfTileExisted] = React.useState([]);
    // Current hover pos
    const [curPosition, setCurPosition] = React.useState({
        r: 3,
        t: 2,
        z: 103,
    });
    //  Mode switch (include 'view', 'default', 'edit')
    const [mode, setMode] = useState("default")
    // World background
    const [worldBg, setWorldBg] = useState()
    // Targeted element id (in edit mode)
    const [targetElementId, setTargetElementId] = useState()
    // Toolbox for targeted element
    const [hasToolbox, setToolbox] = useState(false)
    const [toolboxPos, setToolboxPos] = useState()
    // JSON object for current world
    const [savedWorld, setSavedWorld] = React.useState();
    // World floor
    const [worldFloor, setWorldFloor] = React.useState();
    // Grid level navigation
    const [currentGridLevel, setGridLevel] = React.useState(0);


    // set grid level accordingly to object's in DEFAULT mode
    React.useEffect(()=>{
        if(mode == "default"){
            setGridLevel(placeObj?.gridLevel ?? 0)
        }
    },[placeObj])

    React.useEffect(()=>{
        console.log("current mode", mode);
    },[mode])

    const createWorldObj = useCallback((data) => {
        const {placeObj, pos, targetId} = data
        const {r,t,z} = pos
        return {
            targetId,
            elementId: placeObj?.elementId || worldDb.length+1,
            id: placeObj?.id,
            name: placeObj?.name,
            code: placeObj?.code,
            item: placeObj?.item,
            src: placeObj?.src,
            beachOnly: placeObj?.beachOnly,
            seaOnly: placeObj?.seaOnly,
            landOnly: placeObj?.landOnly,
            gridLevel: placeObj?.gridLevel,
            tileMap: {
                offset: placeObj?.tileMap?.offset,
                size: placeObj?.tileMap?.size,
                isoSize: {
                    x: placeObj?.tileMap?.isoSize?.x,
                    y: placeObj?.tileMap?.isoSize?.y,
                },
                height: placeObj?.tileMap?.height,
                position: { r, t },
                zIndex: z
            },
        };
    }, [worldDb])

    const changeWorldFloor = useCallback((newWorldFloor) => {
        clearWorld()
        const {defaultObjects} = newWorldFloor || {}
        loadDefaultObjects(defaultObjects)
    }, [])

    const getElementIdOnTile = useCallback(({r,t}) => {
        const currentPos = {r,t}

        // find tile base on curent grid level
        const tile = listOfTileExisted.find(tile => tile.r === currentPos.r && tile.t === currentPos.t && tile.gridLevel == currentGridLevel)
        // Ignore default objects
        return tile?.isDefault
            ? null
            : tile?.elementId
    }, [listOfTileExisted,currentGridLevel])

    const deleteWorldElement = useCallback(() =>{
        // Remove targeted element from world
        setWorldDb(oldWorld => {
            const newWorld = oldWorld.filter(item => item.elementId !== targetElementId)
            return newWorld
        })
        // Remove tile's pos of targeted element from existed tile list
        setListOfTileExisted(oldTileList => {
            const newTileList = oldTileList.filter(tile => tile.elementId !== targetElementId)
            return newTileList
        })
    }, [targetElementId])

    const saveElementChanges = useCallback(() => {
        // Reset selected default element
        setDefaultElement(null)
        setSave(true)
    }, [])

    const moveWorldElement = useCallback(() =>{
        // Remove targeted element from world
        setWorldDb(oldWorld => {
            const newWorld = oldWorld.filter(item => {
                if (item.elementId === targetElementId) {
                    setPlaceObj(item)
                    return false
                }
                return true
            })
            return newWorld
        })
        // Remove tile's pos of targeted element from existed tiles list
        setListOfTileExisted(oldTileList => {
            const newTileList = oldTileList.filter(tile => tile.elementId !== targetElementId)
            return newTileList
        })
        // Start action
        setMode("move")
        setBuilderStatus(true)
    }, [targetElementId])

    const handlePlaceObj = (item) => {
        setPlaceObj(item);
        setBuilderStatus(true);
    };

    const saveWorld = useCallback(() => {
        setSavedWorld({
            floor: worldFloor,
            background: worldBg,
            elements: worldDb,
        })
    }, [worldFloor, worldBg, worldDb])

    const loadWorld = useCallback(() => {
        let worldObj
        try {
            worldObj = JSON.parse(localStorage.getItem("savedWorld"))
        }
        catch(err) {
            worldObj = null
        }

        if (!worldObj) {
            isInit.current = true
            return
        } 
        setWorldFloor(worldObj.floor)
        // Load world obj
        setWorldBg(worldObj.background)
        // Re-calculate existed tiles in plate
        setListOfTileExisted([])
        setWorldDb(worldObj.elements?.map((e, index) => {
            const newElement = {
                ...e,
                elementId: index+1
            }
            handleGetPlacePosition(newElement)
            return newElement
        }))

        // Disable restore action
        setRestore(false)
    }, [])

    const loadDefaultObjects = useCallback((defaultObjects) => {
        setWorldDb(oldWorld => {
            const newWorld = [...oldWorld]
            defaultObjects?.map(obj => {
                const {pos} = obj
                const itemsInCategory = items?.find(i => i.name === obj.category)
                const selectedItem = itemsInCategory?.data?.find(i => i.id === obj.id)

                const defaultObj = createWorldObj({
                    placeObj: selectedItem, 
                    pos: {
                        r: pos.r, 
                        t: pos.t, 
                        z: pos.r + 100 - pos.t
                    },
                    targetId: obj.targetId
                })
                newWorld.push(defaultObj)
                handleGetPlacePosition(defaultObj)
            })
            return newWorld
        })
    }, [])

    const loadDefaultFloor = useCallback(() => {
        setWorldFloor(oldFloor => {
            const itemsInCategory = items?.find(i => i.name === "floor")
            const selectedItem = itemsInCategory?.data?.find(i => i.isDefault)

            changeWorldFloor(selectedItem)

            return selectedItem
        })
    }, [])

    const clearWorld = useCallback(() => {
        setListOfTileExisted([])
        setWorldDb([]);
    }, [])
    const handleTileClickBuilder = () => {
        setBuilderStatus(false);
    };

    const handleGetPosition = (pos) => {
        setCurPosition(pos);
    };

    const hasRangeIn = useCallback((range, tilePos) => {
        const {t,r} = range
        return (
            tilePos.r >= r.start &&
            tilePos.r <= r.end
        ) && (
            tilePos.t >= t.start &&
            tilePos.t <= t.end
        )
    }, [])

    const isOverlap = useCallback((pos, isoSize) => {
        const {r,t} = pos
        for (let i = r; i < r + isoSize.x; i++) {
            for (let j = t; j < t + isoSize.y; j++) {
                const isExisted = listOfTileExisted.find(tile => tile?.r===i && tile?.t===j )

                if (isExisted) {
                    return true
                }
            }
        } 
        return false
    }, [listOfTileExisted])


    const isOverlapObject = useCallback((pos, isoSize)=>{
        const {r,t} = pos
        for (let i = r; i < r + isoSize.x; i++) {
            for (let j = t; j < t + isoSize.y; j++) {
                const isExisted = listOfTileExisted.find(tile => tile?.r===i && tile?.t===j && tile?.gridLevel == 1)

                if (isExisted){
                    //  Check whether there is another object in the existed tile
                    const isOccupied = listOfTileExisted.find(tile => tile?.r === isExisted?.r && tile?.t === isExisted?.t && !tile?.gridLevel == 1)
                    
                    if(isOccupied){
                        return false
                    }

                    return true
                }
            }
        }

        return false

    },[listOfTileExisted])

    const isPlaceable = useCallback(({r,t}) => {
        const {areas} = worldFloor || {}

        return (
            // Default rules
            !isOverlap({r,t}, placeObj?.tileMap?.isoSize) ||
            // GridLevel 1 object can overlap GridLevel 0 object... 
            ( placeObj?.gridLevel == 1 &&
            // ...except itself
              !listOfTileExisted.find(tile => tile?.r === r && tile?.t === t && tile?.gridLevel == 1) 
            ) 
            // only one object can ben placed in the same tile as GridLevel 1 object
            || (!placeObj?.gridLevel == 1 && isOverlapObject({r,t}, placeObj?.tileMap?.isoSize)) 
            &&
            // Custom rules for specific areas
            !areas?.some(a => {
                const firstTilePos = {r,t}
                const lastTilePos = {
                    r: r + placeObj?.tileMap?.isoSize?.x - 1,
                    t: t + placeObj?.tileMap?.isoSize?.y - 1
                }
                const range = {
                    r: {
                        start: a.r,
                        end: a.r + a.isoSize?.x - 1
                    },
                    t: {
                        start: a.t,
                        end: a.t + a.isoSize?.y - 1
                    }
                }
                // console.table({
                //     allowedAreas: placeObj?.allowedAreas,
                //     areaName: a?.areaName,
                //     isIncluded: placeObj?.allowedAreas?.includes(a.areaName),
                //     isInRange: !(
                //         hasRangeIn(range, firstTilePos) && 
                //         hasRangeIn(range, lastTilePos)
                //     )
                // })
                return (
                    placeObj?.allowedAreas?.includes(a.areaName) && 
                    !(
                        hasRangeIn(range, firstTilePos) && 
                        hasRangeIn(range, lastTilePos)
                    )
                )
            })
        )
    }, [worldFloor, placeObj, isOverlap])

    // Save current block's placing pos
    const handleGetPlacePosition = (placeObjWithElementId) => {
        const currentPlaceObj = placeObjWithElementId

        if (!currentPlaceObj?.tileMap?.isoSize) {return}

        const currentPos = currentPlaceObj?.tileMap.position
        const {x,y} = currentPlaceObj.tileMap.isoSize

        setListOfTileExisted(oldList => {
            const newList = [...oldList]

            for (let i=currentPos.r; i<currentPos.r+x; i++) {
                for (let j=currentPos.t; j<currentPos.t+y; j++) {
                    newList.push({
                        r: i, 
                        t: j, 
                        elementId: currentPlaceObj.elementId, 
                        elementCode: currentPlaceObj.code,
                        isDefault: currentPlaceObj.targetId ? true : false,
                        gridLevel: currentPlaceObj.gridLevel
                    })
                }
            }

            return newList
        })        
    }

    // React.useEffect(() => {
    //     console.log("Current toolbox:", hasToolbox)
    // }, [hasToolbox])

    // React.useEffect(() => {
    //     console.log(`Current mode: %c${mode}`, "color: red; font-weight: bold; font-size: 1rem;")
    // }, [mode])

    React.useEffect(() => {
        console.log("Current world:", worldDb);
    }, [worldDb]);

    React.useEffect(() => {
        if (isInit.current) {
            console.log("%cNO SAVED ISLAND FOUND! GENERATING NEW ISLAND...", "font-size: 1.5rem; color: red")
            loadDefaultFloor()
            setSave(true)
        }
    }, [isInit.current])

    // React.useEffect(() => {
    //     console.log("Current floor:", worldFloor)
    // }, [worldFloor])

    // React.useEffect(() => {
    //     console.log("Current selected default element:", defaultElement);
    // }, [defaultElement]);

    // React.useEffect(() => {
    //     console.log("Current background:", worldBg)
    // }, [worldBg])

    React.useEffect(() => {
        console.log("Current existed tiles:", listOfTileExisted);
    }, [listOfTileExisted]);

    // React.useEffect(() => {
    //     console.log("Current hovered tile:", targetElementId);
    // }, [targetElementId]);

    React.useEffect(() => {
        console.log("Current place object:", placeObj);
    }, [placeObj]);

    // React.useEffect(() => {
    //     console.log("Current hover block:", curPosition);
    // }, [curPosition]);

    // Load saved world in db
    React.useEffect(() => {
        console.log("Saved world:", savedWorld)

        if (!didLoad) {
            console.log("%cLOADING ISLAND...", "font-size: 2rem; color: yellow")
            loadWorld()
            setLoad(true)
        }

        // Save the current world to db
        if (needSave) {
            localStorage.setItem("savedWorld", JSON.stringify(savedWorld))

            // Disable save action
            setSave(false)
        }
        
    }, [savedWorld, didLoad])

    React.useEffect(() => {
        if (needSave) {
            console.log("%cSAVING...", "color: cyan")

            saveWorld()
        }
    }, [needSave])

    React.useEffect(() => {
        if (needRestore) {
            console.log("%cRESTORING...", "color: #39ff14")

            loadWorld()
        }
    }, [needRestore])

    // Stop placing block
    React.useEffect(() => {
        if (builderStatus && mode!=="move") {
            const handleEscape = (e) => {
                if (e.key == "Escape") {
                    setBuilderStatus(false)
                    setPlaceObj(null)
                }
            }
            document.body.addEventListener('keyup', handleEscape);

            return () => {
                document.body.removeEventListener('keyup', handleEscape)
            }
        }
    }, [builderStatus, mode])

    // Reset states on corresponding mode
    React.useEffect(() => {
        switch (mode) {
            case "move":
                break
            case "edit":
                setBuilderStatus(false)
                setPlaceObj(null)
                break
            default: 
                setToolbox(false)
                setTargetElementId(null)
                break
        }
    }, [mode])
    
    // Reset toolbox on gridLevel change
    React.useEffect(()=> {
        if(mode == "edit"){
            setToolbox(false);
        }
    },[currentGridLevel])

    return (
        <GameContext.Provider
            value={{
                toolboxPos, setToolboxPos, hasToolbox, setToolbox,
                getElementIdOnTile,
                targetElementId, setTargetElementId,
                placeObj, setPlaceObj,
                handlePlaceObj,
                worldDb, setWorldDb,
                worldBg, setWorldBg,
                worldFloor, setWorldFloor, changeWorldFloor,
                clearWorld,
                builderStatus,
                handleTileClickBuilder,
                handleGetPosition,
                curPosition,
                builderErrorStatus, setBuilderErrorStatus,
                handleGetPlacePosition,
                // placePosition,
                listOfTileExisted,
                savedWorld, saveWorld, loadWorld, 
                loadDefaultObjects,
                createWorldObj,
                mode, setMode,
                deleteWorldElement, moveWorldElement,
                setSave, setRestore, 
                defaultElement, setDefaultElement, saveElementChanges,
                isPlaceable,
                currentGridLevel, setGridLevel,
            }}
            {...props}
        />
    );
};

export const useGame = () => React.useContext(GameContext);
export const GameConsumer = GameContext.Consumer;
