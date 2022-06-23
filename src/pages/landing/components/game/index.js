import React from "react";
import { GameProvider } from "../../contexts/gameContextV2";
import { GameHistoryProvider } from "../../contexts/historyContext";
import CardPicker from "./cardPicker";
import Scene from "./scene";
import styles from './styles.module.scss';

export default function Game() {
    return (
        <section className={styles['islander-builder']}>
            <GameHistoryProvider>
                <GameProvider debug={false}>
                        <CardPicker/>
                        <Scene/>
                </GameProvider>
            </GameHistoryProvider>
        </section>
    );
}