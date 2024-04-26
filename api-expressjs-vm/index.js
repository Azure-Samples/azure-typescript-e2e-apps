const os = require('os');
const express = require('express')
const app = express()

app.use('/public', express.static('public'))
app.get('/', function (req, res) {

    const clientIP = req.headers['x-forwarded-for'];
    const msg = `HostName: ${os.hostname()}<br>ClientIP: ${clientIP}<br>DateTime: ${new Date()}<br><img width='200' height='200' src='/public/leaves.jpg' alt='flowers'>`
    console.log(msg)

    res.send(msg)
})
app.listen(3000, function () {
    console.log(`Hello world app listening on port 3000! ${Date.now()}`)
})
