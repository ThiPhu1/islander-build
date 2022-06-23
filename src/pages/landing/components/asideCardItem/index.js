import React, { useCallback } from 'react';
import styles from './styles.module.scss';
import noImg from 'src/common/images/cards/noimg.webp';

import { useGame } from '../../contexts/gameContext';
import { usePopup } from '../popup';

const AsideCardItem = ({ item, tabName }) => {
    const { 
        worldFloor,
        setDefaultElement,
        placeObj, 
        handlePlaceObj, 
        worldDb, 
        setWorldDb,
        builderStatus,
        setWorldBg, 
        mode, 
        clearWorld,
        setSave,
        changeWorldFloor
    } = useGame();
    const {
        togglePopup, 
        setPopupData
    } = usePopup()

    const handleCardClick = useCallback(() => {
        if (mode !== "default") {return}

        if (!item.target) {
            return handlePlaceObj(item);
        } 

        switch (item.target) {
            case "floor":
                // Prevent changing same floor
                if (item?.code === worldFloor?.code) {return}

                setPopupData({
                    withConfirmation: true,
                    title: "Chú ý", 
                    description: `
                        Dữ liệu các vật thể hiện tại sẽ mất sau khi đổi đảo!
                        Bạn chắc chắn muốn thực hiện thao tác này?
                    `, 
                    onConfirm: () => {
                        setDefaultElement({
                            target: item.target,
                            data: item
                        })
                        changeWorldFloor(item)
                    }
                })
                togglePopup()
                break
            default:
                setDefaultElement({
                    target: item.target,
                    data: item
                })
        }
        
        
    }, [mode, item, tabName, worldFloor])
    return (
        <div
            onClick={handleCardClick}
            className={`${styles['islander-sidebar--cards-item']} ${
                builderStatus && placeObj?.code === item?.code ? styles['active'] : ''
            }`}
        >
            <div className={`${styles['islander-sidebar--cards-item-img']}`}>
                <img src={item?.item ? item?.item : noImg} alt={item?.name}/>
            </div>
            <h3 className={styles['islander-sidebar--cards-item-headline']}>
                {item?.name}
            </h3>
            <button className={styles['islander-sidebar--cards-item-btn-place']}>
                Place
            </button>
        </div>
    );
};

export default AsideCardItem;
