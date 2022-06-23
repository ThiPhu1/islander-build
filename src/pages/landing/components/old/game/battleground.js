import React, { useEffect, useRef, useState } from 'react';
import { useGame } from 'src/pages/landing/contexts/gameContext';
import styles from './styles.module.scss';
import { TileSprite } from './tile';

export const Grid = ({ grid, setGrid, isometric, level, children }) => {
    const gridRef = useRef()
    const {worldFloor, placeObj} = useGame() || {}
    
    useEffect(() => {
        const {width, height} = gridRef?.current?.getBoundingClientRect()

        setGrid({
            x: width + (worldFloor?.gridOffset?.x ?? 0),
            xDom: width,
            y: height +  (height / (worldFloor?.worldSize)),
            yDom: height,
            bottom: height / worldFloor?.worldSize,
        })
    }, [gridRef.current, worldFloor])

    return (
        <div
            ref={gridRef}
            className={`
                ${styles['grid']} 
                ${isometric ? styles['iso'] : styles['base']}
            `}
            style={{
                transformOrigin: "top left",
                transform: `
                    rotateX(${worldFloor?.rotateAngle?.x || 54}deg) 
                    rotateY(${worldFloor?.rotateAngle?.y || 0}deg) 
                    rotateZ(${worldFloor?.rotateAngle?.z || -45}deg) 
                    translate(calc(${ level > 0 ? `calc(-26% + ${worldFloor?.gridLevelOffset?.x}%)` : "-55%"} + ${worldFloor?.gridOffset?.x ?? 0}px), calc(${ level > 0 ? `calc(26% + ${worldFloor?.gridLevelOffset?.y}%)` : "55%"} - ${worldFloor?.gridOffset?.y ?? 0}px))
                `,
            }}
        >
            {children}
        </div>
    );
};
export const Row = ({ children }) => {
    return <div className={styles['row']}>{children}</div>;
};
