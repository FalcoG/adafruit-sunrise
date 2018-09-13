const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(3000, 'localhost', () => console.log('Example app listening locally on port 3000!'))