const five = require('johnny-five');
const pixel = require('node-pixel');
const schedule = require('node-schedule');
const Color = require('color');

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

        strip.off();

        schedule.scheduleJob('46 * * * *', () => {
            let i = 0;
            const iterations = 120;

            const sunrise = setInterval(() => {
                if (iterations > i) {
                    i++;

                    strip.color(Color('#FFCA7C').darken((iterations - i) / iterations).rgb().round().array());
                    strip.show();
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
