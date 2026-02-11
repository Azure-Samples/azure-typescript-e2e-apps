const os = require('os');
const crypto = require('crypto');
const express = require('express');
const app = express();

// Correlation ID + request duration middleware
app.use((req, res, next) => {
    const id = req.headers['x-correlation-id'];
    req.correlationId = Array.isArray(id) ? id[0] : id || crypto.randomUUID();
    req.startTime = Date.now();
    res.setHeader('x-correlation-id', req.correlationId);
    res.on('finish', () => {
        const durationMs = Date.now() - req.startTime;
        console.log(JSON.stringify({
            method: req.method,
            path: req.originalUrl,
            statusCode: res.statusCode,
            durationMs,
            correlationId: req.correlationId
        }));
    });
    next();
});

app.use('/public', express.static('public'))
app.get('/', function (req, res) {

    const clientIP = req.headers['x-forwarded-for'];
    const msg = `HostName: ${os.hostname()}<br>ClientIP: ${clientIP}<br>DateTime: ${new Date()}<br><img width='200' height='200' src='/public/leaves.jpg' alt='flowers'>`;
    console.log(`[${req.correlationId}] ${msg}`);

    res.send(msg)
})
app.listen(3000, function () {
    console.log(`Hello world app listening on port 3000! ${Date.now()}`)
})
