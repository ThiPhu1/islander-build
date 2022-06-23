import React, { Component } from 'react';
import Phaser from 'phaser';
import { IonPhaser } from '@ion-phaser/react';

import './styles.scss';
import mapImg from 'src/common/images/cards/el/map/map_01.png';
const Scene = () => {
    const [initialize] = React.useState(true);
    const [game] = React.useState({
        width: 800,
        height: 600,
        type: Phaser.AUTO,
        scene: {
            init: function () {
                this.cameras.main.setBackgroundColor('#24252A');
                this.load.image('tiles', mapImg);
            },
            create: function () {
                //   this.cameras.main.setZoom(2);
                this.avalander = this.add.text(
                    this.cameras.main.centerX,
                    this.cameras.main.centerY,
                    'Avalander',
                    {
                        font: '40px Arial',
                        fill: '#ffffff',
                    }
                );
                this.avalander.setOrigin(0.5);
            },
            update: function () {
                this.avalander.angle += 1;
            },
        },
    });
    return (
        <>
            <IonPhaser game={game} initialize={initialize} />
        </>
    );
};

export default Scene;
