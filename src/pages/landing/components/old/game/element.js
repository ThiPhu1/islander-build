import React, { useEffect } from 'react';
import { useGame } from 'src/pages/landing/contexts/gameContext';
import ElementModel from '../models/Elements';
import {ReactComponent as MoveIcon} from "src/common/images/icons/move.svg"
import {ReactComponent as DeleteIcon} from "src/common/images/icons/delete.svg"
import './styles.scss';

function Element(props) {
    const { item, tileMap, type, src, classList, isBuilder } = props;
    const {
        worldFloor,
        defaultElement,
        worldDb, setWorldDb,
        saveElementChanges,
        hasToolbox,
        setToolboxPos,
        deleteWorldItem,
        curPosition, 
        builderErrorStatus, 
        listOfTileExisted, 
        currentTileWidth, 
        targetElementId, 
        mode, 
        placeObj,
        currentGridLevel,
    } = useGame();
    const el = new ElementModel({
        worldSize: worldFloor?.worldSize,
        name: item?.name,
        code: item?.code,
        src: item?.src,
        item: item?.item,
        tileMap: item?.tileMap,
        isBuilder: isBuilder || false,
        curPosition: curPosition,
        gridLevel: item?.gridLevel,
    })
    // console.log("%cELEMENT","color:blue",el);

    const elPosition = el.getPosition();
    const imgRef = React.useRef(null);
    const [elHeight, setElHeight] = React.useState(null);
    const [isTargeted, setTarget] = React.useState(false)
    const ratioX = item?.tileMap?.isoSize?.x / 2
    const ratioY = item?.tileMap?.isoSize?.y / 2
    const transformOffsetY = 1
    // Offset if needed for overflowed objects (1x1 but size > 1)
    const offsetX = item?.tileMap?.offset || 0
    const polygonPos = {
        x: {
            top: 100 / item?.tileMap?.size * (ratioY + offsetX / 2),
            right: 100 / item?.tileMap?.size * (ratioX + ratioY + offsetX / 2),
            bottom: 100 / item?.tileMap?.size * (ratioX + offsetX / 2),
            left: 100 / item?.tileMap?.size * offsetX / 2
        },
        y: {
            top: 100 - 100 / item?.tileMap?.height * (ratioX + ratioY),
            right: 100 - 100 / item?.tileMap?.height * ratioY,
            bottom: 100,
            left: 100 - 100 / item?.tileMap?.height * ratioX,
        }
    }

    React.useEffect(() => {
        if (!defaultElement || defaultElement?.target !== item.targetId) {return}
        const targetTileIndex = worldDb.findIndex(tile => tile.targetId === defaultElement?.target)
        if (targetTileIndex === -1) {return}

        setWorldDb(oldWorld => {
            const {position, zIndex} = oldWorld[targetTileIndex].tileMap
            const newItem = defaultElement?.data

            oldWorld[targetTileIndex] = {
                ...oldWorld[targetTileIndex],
                id: newItem?.id,
                name: newItem?.name,
                code: newItem?.code,
                item: newItem?.item,
                src: newItem?.src,
                gridLevel: newItem?.gridLevel,
                tileMap: {
                    position, zIndex,
                    height: newItem?.tileMap?.height,
                    offset: newItem?.tileMap?.offset,
                    size: newItem?.tileMap?.size,
                    isoSize: newItem?.tileMap?.isoSize,
                }
            }

            const newWorld = [...oldWorld]
            return newWorld
        })
        saveElementChanges()
    }, [defaultElement, worldDb])

    React.useEffect(() => {
        if (imgRef?.current) {
            const handleLoadedImg = e => {
                setElHeight(e.currentTarget.clientHeight);
            }
            imgRef?.current?.addEventListener("load", handleLoadedImg);

            return () => {
                imgRef?.current?.removeEventListener("load", handleLoadedImg)
            }
        }
    }, [imgRef?.current, item]);

    React.useEffect(() => {
        setTarget(mode==="edit" && item.elementId === targetElementId)
    }, [targetElementId, item, mode])

    React.useEffect(() => {
        if (isTargeted && hasToolbox) {
            // const toolboxPos = {
            //     // bottom: elPosition?.bottom,
            //     left: elPosition?.left,
            //     width: elPosition?.wBase,
            //     height: 40,
            //     translate: {
            //         x: -100 / item?.tileMap?.size * (0.5 * offsetX),
            //         // y: -100 + 100 / item.tileMap.height * (ratioX + 0.5) + transformOffsetY
            //         y: 100 / item?.tileMap?.height * ((item?.tileMap?.isoSize?.x - 1) * 0.5)
            //     }
            // }
            setToolboxPos({
                r: tileMap?.position?.r, 
                t: tileMap?.position?.t,
                item
            })
        }
    }, [isTargeted, elHeight, hasToolbox, item])

    return (
        <>
            <div
                className={`el ${classList} ${builderErrorStatus ? 'error' : ''}`}
                style={{
                    bottom: `${elPosition?.bottom}%`,
                    left: `${elPosition?.left}%`,
                    width: `${elPosition?.wBase}%`,
                    height: `${elHeight}px`,
                    zIndex: el?.gridLevel == 1 ? elPosition?.zIndex + 100 : elPosition?.zIndex ,
                    // transform: `translate(
                    //     ${-100 / (item?.tileMap?.size - offsetX) * 0.5}%, 
                    //     ${-100 + 100 / item?.tileMap?.height * (ratioX + 0.5) + transformOffsetY}%
                    // )`,
                    transform: `translate(
                        ${-100 / item?.tileMap?.size * (0.5 * offsetX)}%, 
                        ${ 
                            el?.gridLevel == 1 ? -46 :
                            100 / item?.tileMap?.height * ((item?.tileMap?.isoSize?.x - 1) * 0.5)
                        }%
                    )`,
                    // in EDIT and MOVE mode, Blur objects that are not in the current grid level
                    opacity: mode == "default" ? 1 : (mode != "default" && el?.gridLevel == currentGridLevel) ? 1 : 0.5 
                }}
            >   
                {!isBuilder && (
                    <style>{`
                        #dom-hover > .el::before {
                            clip-path: polygon(
                                ${polygonPos?.x?.top}% ${polygonPos?.y?.top}%,
                                ${polygonPos?.x?.right}% ${polygonPos?.y?.right}%,
                                ${polygonPos?.x?.bottom}% ${polygonPos?.y?.bottom}%,
                                ${polygonPos?.x?.left}% ${polygonPos?.y?.left}%
                            )
                        }
                    `}</style>
                )}
                <img className={`el__img ${ isTargeted ? "el__img--targeted" : ""}`} ref={imgRef} alt={type} src={src} />
            </div>
        </>
    );
}

export default Element;
