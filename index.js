const five = require('johnny-five');
const pixel = require('node-pixel');

const options = {
    port: 'COM4',
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
        console.log('Led strip PIN5 ready');

        for(let i = 0; i < this.options.quantity - this.options.startPoint; i++) {
            const pixelNumber = i + this.options.startPoint;
            const currentPixel = this.strip.pixel(pixelNumber);

            currentPixel.color('#FF0000');
        }
    })
});
