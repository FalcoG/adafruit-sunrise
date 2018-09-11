const five = require('johnny-five');
const pixel = require('node-pixel');
const schedule = require('node-schedule');
const Color = require('color');
const https = require('https');
const SunCalc = require('suncalc');
const IFTTT = require('./.ifttt.js');

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
        strip.off();

        // Assumes that the device is using UTC and not CE(S)T
        schedule.scheduleJob('55 4 * * *', () => {
            const times = SunCalc.getTimes(new Date(), 52.011257, 4.4392069);

            https.get(`https://maker.ifttt.com/trigger/rpiSunriseStart/with/key/${IFTTT.key}?value1=LED strip is turning on&value2=Today's sunrise is at ${times.sunrise.toLocaleString('nl-NL')}`, (res) => {
                const { statusCode } = res;

                let error;
                if (statusCode !== 200) error = new Error(`Request Failed.\nStatus Code: ${statusCode}`);

                if (error) {
                    console.error(error.message);
                    res.resume();
                }
            }).on('error', (e) => {
                console.error(`Got an error: ${e.message}`);
            });

            let i = 0;
            const iterations = 600;

            const sunrise = setInterval(() => {
                if (iterations > i) {
                    i++;
                    const modifiedColor = Color('#FFCA7C').darken((iterations - i) / iterations);
                    strip.color(`rgb(${Math.round(modifiedColor.red())}, ${Math.round(modifiedColor.green())}, ${Math.round(modifiedColor.blue())})`);
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
