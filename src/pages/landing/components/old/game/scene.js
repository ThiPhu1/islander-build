import React, { useCallback, useMemo, useReducer } from 'react';

import { Grid, Row } from './battleground';
import { Tile, TileSprite } from './tile';

import { reducer, initialState } from '../state';
import { useGame } from '../../../contexts/gameContext';
import { constants, defaultPos } from '../utils/constants';
import styles from './styles.module.scss';

import mapImg from 'src/common/images/map/floor_default_7x7.png';
import tileImg from 'src/common/images/map/tile.png';
import Element from './element';
import { items } from 'src/pages/landing/db';
import Toolbox from './toolbox';

const tiles = [];
for (let i = constants?.WORLD_SIZE; i > 0; i--) {
    tiles.push(Array(constants?.WORLD_SIZE).fill('grass'));
}

function Scene() {
    const {
        isPlaceable,
        setToolbox, hasToolbox, toolboxPos,
        createWorldObj,
        targetElementId,
        setTargetElementId,
        mode,
        setMode,
        setPlaceObj,
        placeObj,
        worldDb,
        setWorldDb,
        builderStatus,
        handleTileClickBuilder,
        builderErrorStatus,
        setBuilderErrorStatus,
        handleGetPlacePosition,
        listOfTileExisted,
        saveWorld, 
        setSave, 
        worldFloor, setWorldFloor,
        defaultElement, saveElementChanges,
        currentGridLevel
    } = useGame();
    const floorRef = React.useRef(null);
    const [gridCssOpen, setGridCssOpen] = React.useState(true);
    const [domOpen, setDomOpen] = React.useState(true);
    const [{ row, col }, dispatch] = useReducer(reducer, initialState);
    const [floor, setFloor] = React.useState({
        x: floorRef?.current?.offsetWidth,
        y: floorRef?.current?.offsetHeight,
    });
    const [grid, setGrid] = React.useState()
    const domStyle = useMemo(() => ({
        width: `${grid?.xDom}px`,
        height: `${grid?.yDom}px`,
        left: `${worldFloor?.domOffset?.x ?? 0}px`,
        bottom: `${grid?.bottom - (worldFloor?.domOffset?.y ?? 0)}px`
    }), [worldDb, grid])

    const handleTileClick = useCallback(({ r, t, z }) => () => {
        switch (mode) {
            case "move": 
                if (placeObj) {
                    const elementId = placeObj.elementId
                    const placeObjWithElementId = createWorldObj({
                        placeObj,
                        pos: {r,t,z}
                    })
        
                    const isSafe = isPlaceable({r,t})
        
                    if (isSafe) {
                        setWorldDb(oldWorld => {
                            let newWorld = [...oldWorld]
                
                            newWorld.push(placeObjWithElementId)
                            return newWorld
                        });
                        handleGetPlacePosition(placeObjWithElementId);
                        setMode("edit")

                        // Open toolbox at new pos
                        setTargetElementId(elementId)
                        setToolbox(true)
                    }
                    else {
                        setBuilderErrorStatus(true);
                    }
                } 
                break
            case "edit":                
                // if (targetElementId) {
                //     setToolbox(true)
                //     // setEditing(true)
                // }
                break
            default:
                if (placeObj) {
                    const placeObjWithElementId = createWorldObj({
                        placeObj,
                        pos: {r,t,z}
                    })

                    const isSafe = isPlaceable({r,t})
        
                    if (isSafe) {
                        setWorldDb(oldWorld => {
                            let newWorld = [...oldWorld]
                
                            newWorld.push(placeObjWithElementId)
                            return newWorld
                        });
                        handleGetPlacePosition(placeObjWithElementId);
                        setSave(true)
                        // Return error on placed pos
                        setBuilderErrorStatus(true)
                    }
                    else {
                        setBuilderErrorStatus(true);
                    }
                } 
                break
        }
    }, [placeObj, mode, targetElementId, createWorldObj])

    // React.useEffect(() => {
    //     console.table(grid)
    // }, [grid])

    // React.useEffect(() => {
    //     if (floorRef?.current) {
    //         setFloor({
    //             x: floorRef?.current?.offsetWidth,
    //             y: floorRef?.current?.offsetHeight,
    //         });
    //     }
    // }, []);

    React.useEffect(() => {
        if (defaultElement?.target !== "floor") {return}

        setWorldFloor(defaultElement?.data)
        saveElementChanges()
    }, [defaultElement])

    return (
        <div className={styles["plate"]}>
            <div
                id="avalander-world"
                ref={floorRef}
                className={styles['map-img']}
                style={{
                    backgroundImage: `url("${worldFloor?.src}")`,
                    width: `${grid?.x}px`,
                    height: `${grid?.y}px`,
                }}
            >
            </div>

            {domOpen && (
                <div
                    id="dom"
                    className={styles['dom']}
                    style={domStyle}
                >
                    {worldDb?.map((item, i) => {
                        return (
                            <Element
                                key={i}
                                item={item}
                                type={item?.code}
                                classList={item?.code}
                                src={item?.src}
                                tileMap={item?.tileMap}
                                isBuilder={true}
                            />
                        );
                    })}
                </div>
            )}

            {builderStatus && (
                <div
                    id="dom-hover"
                    className={styles['dom']}
                    style={domStyle}
                >
                    {
                        <Element
                            item={placeObj}
                            type={placeObj?.code}
                            classList={placeObj?.code}
                            src={placeObj?.src}
                            tileMap={placeObj?.tileMap}
                            isBuilder={false}
                            builderErrorStatus={builderErrorStatus}
                        />
                    }
                </div>
            )}

            {gridCssOpen && (
                <div
                    className={styles['grid-map']}
                    style={{
                        width: `${grid?.x}px`,
                        height: `${grid?.y}px`,
                    }}
                >
                    <Grid isometric={true} setGrid={setGrid} grid={grid} level={currentGridLevel}>
                        {Array(worldFloor?.worldSize)
                            .fill('r')
                            .map((_, rIndex) => (
                                <Row key={rIndex}>
                                    {Array(worldFloor?.worldSize)
                                        .fill('t')
                                        .map((_, tIndex) => {
                                            const z = rIndex + 100 - tIndex;
                                            return (
                                                <TileSprite
                                                    handleTileClick={handleTileClick(
                                                        {
                                                            r: rIndex,
                                                            t: tIndex,
                                                            z: z,
                                                        }
                                                    )}
                                                    key={tIndex}
                                                    r={rIndex}
                                                    t={tIndex}
                                                    z={z}
                                                    player={
                                                        rIndex === row &&
                                                        tIndex === col
                                                    }
                                                />
                                            );
                                        })}
                                </Row>
                            ))
                        }
                    </Grid>

                    {hasToolbox && toolboxPos && (
                        <Toolbox toolboxPos={toolboxPos}/>
                    )}
                </div>
            )}
        </div>
    );
}

export default Scene;
