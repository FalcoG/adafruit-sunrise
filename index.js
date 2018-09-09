const five = require('johnny-five');
const pixel = require('node-pixel');
const schedule = require('node-schedule');

const options = {
    pin: 5,
    startPoint: 12,
    quantity: 121
};

const board = new five.Board();

board.on('ready', () => {
    console.log('Arduino ready');

    const strip = new pixel.Strip({
        board,
        controller: 'FIRMATA',
        strips: [{
            pin: options.pin,
            length: options.quantity
        }],
        gamma: 2.8 // WS2812 gamma
    });

    strip.on('ready', () => {
        console.log('Led strip ready');

        // for(let i = 0; i < options.quantity - options.startPoint; i++) {
        //     const pixelNumber = i + options.startPoint;
        //     const currentPixel = strip.pixel(pixelNumber);
        //
        //     currentPixel.color('#00003E');
        // }
        //
        // strip.show();
        strip.off();

        schedule.scheduleJob('45 * * * *', () => {
            const lighting = {
                start: [0, 0, 0], // #FFCA7C
                end: [255, 202, 124],
                steps: 120, // * 0.5 = the amount of seconds
                stepsCompleted: 0,
            };

            const sunrise = setInterval(() => {
                if (lighting.steps > lighting.stepsCompleted) {

                    lighting.start.forEach((item, index, array) => {
                        array[index] += Math.floor(((lighting.end[index] - item) / lighting.steps - 1) * lighting.stepsCompleted);
                    });

                    strip.color(lighting.start);
                    strip.show();

                    lighting.stepsCompleted++;
                } else {
                    clearInterval(sunrise);
                    strip.off();
                }
            }, 500);
        });

        process.on('SIGINT', () => {
            console.log(strip);
            strip.off();
        });
    })
});
