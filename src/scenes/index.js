import Phaser, { Math } from 'phaser';
import SubmarineImg from '../assets/images/submarine.png';
import SunImg from '../assets/images/sun.png';
import Cloud1Img from '../assets/images/cloud-1.png';
import Cloud2Img from '../assets/images/cloud-2.png';
import Cloud3Img from '../assets/images/cloud-3.png';
import WaterPlugin from '../plugins/water';

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
            this.game.config.height / 2 + 8
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
            this.game.config.height / 2 + 8
        );

        canvasTexture.refresh();

        this.add.image(0, 0, 'sky').setOrigin(0, 0);
        this.add.image(this.game.config.width / 2 + 200, 100, 'sun');
        this.cloud1 = this.add
            .image(this.game.config.width / 2 + 500, 75, 'cloud-1')
            .setOrigin(0, 0);
        this.cloud2 = this.add
            .image(
                this.game.config.width / 2,
                this.game.config.height / 2 - 150,
                'cloud-2'
            )
            .setOrigin(0, 0);
        this.cloud3 = this.add
            .image(this.game.config.width / 2 - 600, 25, 'cloud-3')
            .setOrigin(0, 0);
    }
    moveCloud(cloud, speed) {
        cloud.x += speed;
        if (cloud.x > this.game.config.width) {
            this.resetCloudPosition(cloud);
        }
    }
    moveClouds() {
        this.moveCloud(this.cloud1, 0.5);
        this.moveCloud(this.cloud2, 0.5);
        this.moveCloud(this.cloud3, 0.5);
    }

    resetCloudPosition(cloud) {
        console.log(cloud);
        cloud.x = -cloud.width;
        cloud.y = Math.Between(50, this.game.config.height / 2 - cloud.height);
    }

    preload() {
        this.load.image('player', SubmarineImg);
        this.load.image('sun', SunImg);
        this.load.image('cloud-1', Cloud1Img);
        this.load.image('cloud-2', Cloud2Img);
        this.load.image('cloud-3', Cloud3Img);
        this.load.plugin('water', WaterPlugin);
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

        this.waterTexture = this.textures.createCanvas(
            'waterTexture',
            this.game.config.width,
            this.game.config.height / 2
        );

        this.plugins.get('water').create(this.waterTexture);

        this.add
            .image(0, this.game.config.height / 2, 'waterTexture')
            .setOrigin(0, 0);
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
        //this.player.setDepth(1);
        this.plugins.get('water').update();
        this.waterTexture.refresh();
        this.moveClouds();
    }
}
