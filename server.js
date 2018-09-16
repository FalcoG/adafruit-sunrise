const express = require('express')
const app = express()

app.set('test', 'what is this')
app.get('/', (req, res) => res.send('Hello World!'))

function authorized (req) {
    console.log(req);
    return true
}

app.use((req, res, next) => {
    if (authorized(req)) next()
    else return res.redirect('/')
})

app.use('/api/v1', require('./api/v1'))

app.listen(3000, 'localhost', () => console.log('Example app listening locally on port 3000!'))