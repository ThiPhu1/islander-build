import React from 'react';
import { useGame } from '../../contexts/gameContext';
import styles from './styles.module.scss';

const AsideTabItem = ({
    item,
    activeTab,
    setActiveTab,
    handleSelectTab,
}) => {
    const handleClick = (e) => {
        setActiveTab(item?.name);
        handleSelectTab(item);
    };
     
    return (
        <li
            className={`
                ${styles['islander-sidebar--tabs-list-item']}
                ${activeTab == item?.name ? styles['active'] : ''}
            `}
            onClick={handleClick}
        >
            <img
                src={activeTab == item?.name ? item?.activeSrc : item?.src}
                alt={item?.name}
                height={24}
                width={24}
            />
        </li>
    );
};

export default AsideTabItem;
