import React, { useCallback } from 'react';
import styles from './styles.module.scss';
import { constants } from '../utils/constants';
import { useGame } from 'src/pages/landing/contexts/gameContext';
export const Tile = (props) => {
    const { src, x, y, z } = props;
    const xRound = Math.round(x);
    const yRound = Math.round(y);
    const xAbs = Math.round(x * 100000) / 100000;
    const yAbs = Math.round(y * 100000) / 100000;
    const tileRef = React.useRef(null);
    const yBase = 97 * constants?.TILE_ASPECT_RATIO;

    return (
        <div
            ref={tileRef}
            className={`${styles['tile']} tile--${xRound}x${yRound}`}
            style={{ left: `${x}%`, top: `${y}%`, zIndex: z, height: yBase }}
            onClick={() => {
                console.log({
                    x: x,
                    y: y,
                });
            }}
        >
            <h6>
                x:{xRound} - y: {yRound} - z: {z}
            </h6>
        </div>
    );
};
export const TileSprite = (props) => {
    const { handleTileClick, t, r, z } = props;
    const {
        isPlaceable,
        setToolbox,
        mode,
        placeObj,
        handleGetPosition,
        builderStatus,
        curPosition,
        builderErrorStatus,
        setBuilderErrorStatus,
        listOfTileExisted,
        setTargetElementId,
        getElementIdOnTile
    } = useGame();
    const xBase = 7.14286;
    const yBase = 6.2337;
    const xAbs = Math.abs(xBase * (r + t + 1));
    const yAbs = Math.abs(yBase * (t - r - 6));
    const xRound = Math.round(xAbs);
    const yRound = Math.round(yAbs);
    const tileRef = React.useRef()
    const [dom, setDom] = React.useState(true)

    const handleOnMouseEnter = useCallback(() => {
        handleGetPosition({ r, t, z });
        switch (mode) {
            case "edit":
                const elementId = getElementIdOnTile({r,t})
                // console.log("elementID",elementId);
                setTargetElementId(elementId)
                // Open toolbox
                if (elementId) {
                    setToolbox(true)
                }
                else {
                    setToolbox(false)
                }
                break
            default:
                if (!builderStatus) {return}

                // const isSafe = validateBlockOnTile({placeObj, r,t,listOfTileExisted})
                const isSafe = isPlaceable({r,t})

                setBuilderErrorStatus(!isSafe)
                break
        }
    }, [mode, placeObj, getElementIdOnTile])

    // const handleOnMouseLeave = () => {
    //     handleGetPosition({ r, t, z });
    // };

    return (
        <>
            <div
                ref={tileRef}
                className={`${styles['tile']} tile--${r}x${t} test`}
                onClick={handleTileClick}
                // onMouseLeave={builderStatus ? handleOnMouseLeave : null}
                onMouseEnter={handleOnMouseEnter}
                style={{
                    width: constants.TILE_SIZE,
                    height: constants.TILE_SIZE
                }}
            >
                {
                    dom && (
                    <h6>
                        x:{xRound} - y: {yRound}<br/>
                        r: {r} - t: {t} - z: {z}
                    </h6>
                    )
                }
            </div>
        </>
    );
};
