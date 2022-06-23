import React from 'react';
import styles from './styles.module.scss';
import bushImg01 from 'src/common/images/cards/tabs/tree/bush-01-1-x-1.webp';
import { useGame } from '../../../contexts/gameContext';
function Player({ id }) {
    const { placeObj, setPlaceObj } = useGame();
    return (
        <div className={styles['player']} id={id}>
            <img className={styles['img']} src={placeObj?.url} />
        </div>
    );
}

export default Player;
