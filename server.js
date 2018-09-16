const express = require('express')
const app = express()
const config = require('./.ifttt.js')
const led = require('./api/led')

app.use(express.json())

app.set('test', 'what is this')
app.get('/', (req, res) => res.send('Hello World!'))

app.use((req, res, next) => {
    if (req.body.uuid === config.uuid) next()

    else return res.status(403).json({
        message: 'You are not authorized'
    })
})

app.use('/api/v1', require('./api/v1'))

new led(5, 121).then(strip => {
    app.set('led_strip', strip)

    app.listen(3000, 'localhost', () => console.log('Example app listening locally on port 3000!'))
}).catch(e => {
    console.log(e);
})