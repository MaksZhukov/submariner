import Phaser from 'phaser';
import WaterBodyPlugin from 'phaser-plugin-water-body';
import { GameScene } from './scenes';

let game = new Phaser.Game({
    type: Phaser.AUTO,
    backgroundColor: '#fff',
    width: window.innerWidth,
    height: window.innerHeight,
    plugins: {
        global: [
            {
                key: 'WaterBodyPlugin',
                mapping: 'waterplugin',
                plugin: WaterBodyPlugin,
                start: true,
            },
        ],
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        },
    },
    scene: GameScene,
});
