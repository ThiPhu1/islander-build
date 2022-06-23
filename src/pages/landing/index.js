import React, { useEffect, useLayoutEffect, useState } from 'react';
import Layout from 'src/components/layout';
import styles from './styles.module.scss';
import AsideTabItem from './components/asideTabItem';
import { items } from './db';
import AsideCardItem from './components/asideCardItem';
import { RecoilRoot } from 'recoil';
import Scene from './components/old/game/scene';
import { GameProvider, useGame } from './contexts/gameContext';
import {ReactComponent as PencilIcon} from "src/common/images/icons/edit.svg"
import {ReactComponent as ArrowUp} from "src/common/images/icons/arrow-up.svg"
import {ReactComponent as ArrowDown} from "src/common/images/icons/arrow-down.svg"
import { PopupProvider } from './components/popup';
import Game from './components/game';

const LandingPage = () => {

    return (
        <>
            <RecoilRoot>
                <Layout>
                <PopupProvider>
                    {/* <GameProvider>
                        <div className={styles['islander']}>
                            <SideBar/>
                            <SceneWrapper/>
                        </div>
                    </GameProvider> */}
                    <Game/>
                </PopupProvider>
                </Layout>
            </RecoilRoot>
        </>
    );
};


const SideBar = () => {
    const [activeTab, setActiveTab] = React.useState('house');
    const [cardList, setCardList] = React.useState(items[0]);
    const [selectCard, setSelectCard] = React.useState();

    const handleSelectTab = (tabList) => {
        setCardList(tabList);
    };

    return(
        <aside className={styles['islander-sidebar']}>
            <div
                className={styles['islander-sidebar--tabs']}
            >
                <ul
                    className={
                        styles[
                            'islander-sidebar--tabs-list'
                        ]
                    }
                >
                    {items?.map((item, i) => (
                        <AsideTabItem
                            key={i}
                            item={item}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            handleSelectTab={handleSelectTab}
                        />
                    ))}
                </ul>
            </div>
            <div
                className={
                    styles['islander-sidebar--cards']
                }
            >
                {cardList?.data?.map((item, i) => (
                    <AsideCardItem
                        key={i}
                        item={{
                            ...item,
                            target: cardList?.target || item.target,
                            gridLevel: cardList?.gridLevel || 0,
                        }}
                        tabName={cardList?.name}
                    />
                ))}
            </div>
        </aside>
    );
};

const SceneWrapper = () => {
    const {
        saveWorld, 
        setWorldBg,
        defaultElement,
        saveElementChanges,
        mode, 
        setMode, 
        worldBg,
        loadWorld,
        setSave,
        setRestore,
        currentGridLevel,
        setGridLevel,
    } = useGame();
    const islanderBuild = React.useRef();
    const [needExit, setExit] = useState(false)
    const [isSaved, setSaved] = useState(false)

    const handleEdit = e => {
        setMode("edit")    
    }
    const handleExit = () => {
        setRestore(true)
        setMode("default")
    }

    const handleSaveWorld = () => {
        setSave(true)
        setSaved(true)

        setTimeout(()=>{
            setSaved(false)
            setMode("default")
        },1000)
    }

    useLayoutEffect(() => {
        switch (mode) {
            case "default": 
                setExit(false)
                // reset grid level
                setGridLevel(0)
                break
            default: 
                setExit(true)
                break
        }
    }, [mode])

    useEffect(() => {
        if (defaultElement?.target !== "background") {return }

        setWorldBg(defaultElement?.data.src)
        saveElementChanges()
    }, [defaultElement])


    const handleGridLevelSwitch = React.useCallback(()=>{
        if(currentGridLevel == 0){
            setGridLevel(1)
        } else {
            setGridLevel(0)
        }
    },[currentGridLevel])

    // btn-grid disable condition
    const gridUpDisabled = React.useMemo(()=>{
        console.log("up");

        return currentGridLevel === 1
    },[currentGridLevel]);
    const gridDownDisabled = React.useMemo(()=>{
        console.log("down");

        return currentGridLevel === 0
    },[currentGridLevel]);


    return (
        <section
            id={styles['islander-build']}
            style={{
                backgroundImage: `url(${worldBg})`,                                    
            }}
            ref={islanderBuild}
        >   
            <div className={`${styles['map']}`}>
                <div className={styles["btn-group"]}>
                    {mode==="default" && (
                        <button 
                            className={styles[`btn-edit`]}
                            onClick={handleEdit}
                        >
                            <PencilIcon/>
                        </button>
                    )}
                </div>
                {needExit && mode!=="move" && (
                    <>
                    <div className={styles["btn-group-top"]}>
                        <button className={styles["btn-grid-up"]} disabled={gridUpDisabled} onClick={handleGridLevelSwitch}>
                            <ArrowUp opacity={gridUpDisabled ? "0.5" : "1"}/>
                        </button>
                        <button className={styles["btn-grid-down"]} disabled={gridDownDisabled} onClick={handleGridLevelSwitch}>
                            <ArrowDown  opacity={gridDownDisabled ? "0.5" : "1"}/>
                        </button>
                    </div>
                    
                    <div className={styles["btn-group-bottom"]}>
                        {!isSaved && (
                            <button 
                                className={styles["btn-cancel"]}
                                onClick={handleExit}
                            >Cancel</button>
                        ) }
                        <button 
                            className={styles["btn-save"]} 
                            onClick={handleSaveWorld} 
                            disabled={isSaved}
                        >{isSaved ? "Saved!" : "Save"}</button>
                    </div>
                    </>
                )}
                <Scene />
            </div>
        </section>
    )
}

export default LandingPage;
