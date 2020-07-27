import Phaser from 'phaser';
import SubmarineImg from '../assets/images/submarine.png';

export class GameScene extends Phaser.Scene {
    preload() {
        this.load.image('player', SubmarineImg);
    }

    create() {
        this.isGameStarted = false;

        this.score = this.add.text(15, 15, 'SCORE \n00000');
        this.score.setFontFamily('Freckle Face');
        this.score.setFontSize(34);

        let gradient = this.score.context.createLinearGradient(
            0,
            0,
            0,
            this.score.height
        );

        gradient.addColorStop(0, '#d1a6ff');
        gradient.addColorStop(1, '#a277ff');

        this.score.setFill(gradient);

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
