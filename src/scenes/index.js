import Phaser from 'phaser';
import SubmarineImg from '../assets/images/submarine.png';
import SunImg from '../assets/images/sun.png';
import Cloud1Img from '../assets/images/cloud-1.png';
import Cloud2Img from '../assets/images/cloud-2.png';
import Cloud3Img from '../assets/images/cloud-3.png';

export class GameScene extends Phaser.Scene {
    createScore() {
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
    }

    createHeaven() {
        let canvasTexture = this.textures.createCanvas(
            'sky',
            this.game.config.width,
            this.game.config.height / 2
        );

        let graphics = canvasTexture.context.createRadialGradient(
            this.game.config.width / 2 + 200,
            100,
            30,
            this.game.config.width / 2 + 200,
            120,
            200
        );
        graphics.addColorStop(0.1, '#e0f9ff');
        graphics.addColorStop(1, '#90ebff');

        canvasTexture.context.fillStyle = graphics;
        canvasTexture.context.fillRect(
            0,
            0,
            this.game.config.width,
            this.game.config.height / 2
        );

        canvasTexture.refresh();

        this.add.image(0, 0, 'sky').setOrigin(0, 0);
        this.add.image(this.game.config.width / 2 + 200, 100, 'sun');
        this.add.image(this.game.config.width / 2 + 600, 150, 'cloud-1');
        this.add.image(
            this.game.config.width / 2,
            this.game.config.height / 2 - 150,
            'cloud-2'
        );
        this.add.image(this.game.config.width / 2 - 400, 100, 'cloud-3');
    }
    preload() {
        this.load.image('player', SubmarineImg);
        this.load.image('sun', SunImg);
        this.load.image('cloud-1', Cloud1Img);
        this.load.image('cloud-2', Cloud2Img);
        this.load.image('cloud-3', Cloud3Img);
    }

    create() {
        this.isGameStarted = false;

        this.createHeaven();
        this.createScore();

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
