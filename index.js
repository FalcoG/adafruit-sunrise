const five = require('johnny-five');
const pixel = require('node-pixel');

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

        for(let i = 0; i < options.quantity - options.startPoint; i++) {
            const pixelNumber = i + options.startPoint;
            const currentPixel = strip.pixel(pixelNumber);

            currentPixel.color('#FFFFFF');
        }

        strip.show();
    })
});

process.on('SIGINT', () => {
    console.log(strip);
    strip.off();
});
