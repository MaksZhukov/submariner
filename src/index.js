import Phaser from 'phaser';
import { GameScene } from './scenes';

let game = new Phaser.Game({
    type: Phaser.AUTO,
    backgroundColor: '#fff',
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        },
    },
    scene: GameScene,
});
