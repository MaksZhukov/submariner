import Phaser, { Math } from "phaser";
import SubmarineImg from "../assets/images/submarine.png";
import SunImg from "../assets/images/sun.png";
import Cloud1Img from "../assets/images/cloud-1.png";
import Cloud2Img from "../assets/images/cloud-2.png";
import Cloud3Img from "../assets/images/cloud-3.png";
import Ship1Img from "../assets/images/ship-1.png";
import Ship2Img from "../assets/images/ship-2.png";
import WaterPlugin from "../plugins/water";

export class GameScene extends Phaser.Scene {
    createScore() {
        this.score = this.add.text(15, 15, "SCORE \n00000");
        this.score.setFontFamily("Freckle Face");
        this.score.setFontSize(34);

        let gradient = this.score.context.createLinearGradient(
            0,
            0,
            0,
            this.score.height
        );

        gradient.addColorStop(0, "#d1a6ff");
        gradient.addColorStop(1, "#a277ff");

        this.score.setFill(gradient);
    }

    createHeaven() {
        let canvasTexture = this.textures.createCanvas(
            "sky",
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
        graphics.addColorStop(0.1, "#e0f9ff");
        graphics.addColorStop(1, "#90ebff");

        canvasTexture.context.fillStyle = graphics;
        canvasTexture.context.fillRect(
            0,
            0,
            this.game.config.width,
            this.game.config.height / 2 + 8
        );

        canvasTexture.refresh();

        this.add.image(0, 0, "sky").setOrigin(0, 0);
        this.add.image(this.game.config.width / 2 + 200, 100, "sun");
        this.cloud1 = this.add
            .image(this.game.config.width / 2 + 500, 75, "cloud-1")
            .setOrigin(0, 0);
        this.cloud2 = this.add
            .image(
                this.game.config.width / 2,
                this.game.config.height / 2 - 150,
                "cloud-2"
            )
            .setOrigin(0, 0);
        this.cloud3 = this.add
            .image(this.game.config.width / 2 - 600, 25, "cloud-3")
            .setOrigin(0, 0);
    }
    createShips() {
        let [ship1] = this.textures.get("ship-1").source;
        let [ship2] = this.textures.get("ship-2").source;
        this.ship1 = this.add
            .image(
                this.game.config.width / 4 - ship1.width / 2,
                this.game.config.height / 2 - ship1.height + 20,
                "ship-1"
            )
            .setOrigin(0, 0);
        this.ship2 = this.add
            .image(
                this.game.config.width * 0.75 - ship2.width / 2,
                this.game.config.height / 2 - ship2.height + 15,
                "ship-2"
            )
            .setOrigin(0, 0);
    }

    animateShips() {
        // this.ship1.rotation += 0.01;
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
        cloud.x = -cloud.width;
        cloud.y = Math.Between(50, this.game.config.height / 2 - cloud.height);
    }

    preload() {
        this.load.image("player", SubmarineImg);
        this.load.image("sun", SunImg);
        this.load.image("cloud-1", Cloud1Img);
        this.load.image("cloud-2", Cloud2Img);
        this.load.image("cloud-3", Cloud3Img);
        this.load.image("ship-1", Ship1Img);
        this.load.image("ship-2", Ship2Img);
        this.load.plugin("water", WaterPlugin, true, "water");
    }

    create() {
        this.isGameStarted = false;
        this.createHeaven();
        this.createScore();
        this.createShips();

        this.player = this.physics.add
            .image(
                this.game.config.width / 2,
                this.game.config.height / 2,
                "player"
            )
            .setCollideWorldBounds(true);

        this.plugins
            .get("water")
            .create(this.game.config.width, this.game.config.height / 2);

        this.add.image(0, this.game.config.height / 2, "water").setOrigin(0, 0);

        this.keyboard = this.input.keyboard.addKeys("LEFT, RIGHT, SPACE");
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

        this.plugins.get("water").update();

        this.moveClouds();
        this.animateShips();
    }
}
