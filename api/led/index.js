const five = require('johnny-five');
const pixel = require('node-pixel');

class LED {
    constructor(pin = 5, length = 121) {
        return new Promise((resolve, reject) => {
            const board = new five.Board();

            board.on('ready', () => {
                const strip = new pixel.Strip({
                    board,
                    controller: 'FIRMATA',
                    strips: [{
                        pin,
                        length
                    }],
                    gamma: 2.8 // WS2812 gamma
                });

                strip.on('ready', () => {
                    strip.off()
                    resolve(strip)
                })

                strip.on('error', e => {
                    reject(e)
                })
            })

            board.on('error', e => {
                reject(e)
            })
        })
    }
}

module.exports = LED