import Phaser, { Math } from 'phaser';

class WaterPlugin extends Phaser.Plugins.BasePlugin {
    create(width, height) {
        this.waterTexture = this.game.textures.createCanvas(
            'water',
            width,
            height
        );
        this.canvas = this.waterTexture.canvas;
        this.context = this.waterTexture.context;

        //water column every <x> pixels
        this.WAVE_FREQ = 5;

        this.WAV_PASS = 6;

        //get wave count needed for screen width
        this.WAVE_COUNT = this.canvas.width / this.WAVE_FREQ + 1;

        //start height
        this.HEIGHT = 0;

        /*VARIABLES TO TWEAK*/

        //how fast waves spread 0 - 0.5
        this.SPREAD = 0.2;
        //dampening factor
        this.DAMP = 0.005;
        /*tension of spring*/
        this.TENSION = 0.01;
        /*speed*/
        this.SPEED = 0;

        this.WAVES_FREQUENCY = 10;

        //array of springs / columns for water
        this.springs = [];

        this.createSprings();
    }
    createSprings() {
        for (let i = 0; i < this.WAVE_COUNT; i++) {
            let newWave = {};
            newWave.x = i * this.WAVE_FREQ;
            newWave.speed = this.SPEED;
            newWave.height = this.HEIGHT;
            newWave.update = function (self) {
                let x = self.HEIGHT - this.height;
                this.speed += self.TENSION * x - this.speed * self.DAMP;
                this.height += this.speed;
            };
            this.springs[i] = newWave;
        }
        setInterval(this.generateWaves, 100);
    }

    generateWaves = () => {
        for (let i = 0; i < this.WAVES_FREQUENCY; i++) {
            this.springs[Math.Between(0, this.springs.length - 1)].speed = 2;
        }
    };

    update() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.updateWater();
        this.drawWater();
        this.waterTexture.refresh();
    }
    updateWater() {
        //update springs
        for (var i = 0; i < this.springs.length; i++) {
            this.springs[i].update(this);
        }

        var leftDeltas = [];
        var rightDeltas = [];

        //go through and update springs based off of their siblings
        leftDeltas.length = this.springs.length;
        rightDeltas.length = this.springs.length;
        // do some passes where springs pull on their neighbours
        for (var j = 0; j < this.WAV_PASS; j++) {
            //create arrays for springs to the left and right of each spring/column
            for (var i = 0; i < this.springs.length; i++) {
                if (i > 0) {
                    leftDeltas[i] =
                        this.SPREAD *
                        (this.springs[i].height - this.springs[i - 1].height);
                    this.springs[i - 1].speed += leftDeltas[i];
                }
                if (i < this.springs.length - 1) {
                    rightDeltas[i] =
                        this.SPREAD *
                        (this.springs[i].height - this.springs[i + 1].height);
                    this.springs[i + 1].speed += rightDeltas[i];
                }
            }

            //update the position of each spring/column based on the sibling/delta arrays
            for (var i = 0; i < this.springs.length; i++) {
                if (i > 0) this.springs[i - 1].height += leftDeltas[i];
                if (i < this.springs.length - 1)
                    this.springs[i + 1].height += rightDeltas[i];
            }
        }
    }

    drawWater() {
        for (var i = 0; i < this.springs.length; i++) {
            if (i != this.springs.length - 1) {
                this.connectSprings(this.springs[i], this.springs[i + 1]);
            }
        }
    }

    connectSprings(vOne, vTwo) {
        let col1 = '#77d7ffe6';
        let col2 = '#00b3ff80';

        let grd = this.context.createLinearGradient(
            0,
            vOne.height,
            0,
            this.canvas.height
        );
        grd.addColorStop(0.3, col1);
        grd.addColorStop(1, col2);

        //fill water area
        this.context.fillStyle = grd;
        this.context.beginPath();
        this.context.moveTo(vOne.x, vOne.height);
        this.context.lineTo(vTwo.x, vTwo.height);
        this.context.lineTo(vTwo.x, this.canvas.height);
        this.context.lineTo(vOne.x, this.canvas.height);
        this.context.lineTo(vOne.x, vOne.height);
        this.context.closePath();
        this.context.fill();
    }
}

export default WaterPlugin;
