import Phaser from 'phaser';
import SubmarineImg from '../assets/images/submarine.png';

export class GameScene extends Phaser.Scene {
    preload() {
        this.load.image('player', SubmarineImg);
    }

    create() {
        this.isGameStarted = false;

        this.player = this.physics.add.image(
            this.game.config.width / 2,
            this.game.config.height / 2,
            'player'
        );

        this.player.setCollideWorldBounds(true);

        this.keyboard = this.input.keyboard.addKeys('LEFT, RIGHT, SPACE');
    }

    update() {
        if (this.isGameStarted && this.keyboard.LEFT.isDown) {
            this.player.x -= 5;
        }
        if (this.isGameStarted && this.keyboard.RIGHT.isDown) {
            this.player.x += 5;
        }
        if (!this.isGameStarted && this.keyboard.SPACE.isDown) {
            this.isGameStarted = true;
            this.physics.world.gravity.set(0, 200);
        }
    }
}
