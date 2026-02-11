const express = require('express')
const app = express()
const os = require('os');
const crypto = require('crypto');

// console.log(JSON.stringify(process.env));

const AppInsights = require('applicationinsights');

if (process.env.APPINSIGHTS_INSTRUMENTATIONKEY) {
    console.log(`AppInsights configured with key ${process.env.APPINSIGHTS_INSTRUMENTATIONKEY}`);
} else{
    console.log(`AppInsights not configured`);
}

AppInsights.setup(process.env.APPINSIGHTS_INSTRUMENTATIONKEY)
    .setAutoDependencyCorrelation(true)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true, true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectConsole(true)
    .setUseDiskRetryCaching(true)
    .setSendLiveMetrics(false)
    .setDistributedTracingMode(AppInsights.DistributedTracingModes.AI)
    .start();

const AppInsightsClient = AppInsights.defaultClient;

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


app.get('/trace', (req, res) => {

    const clientIP = req.headers['x-forwarded-for'];
    const msg = `trace route ${os.hostname()} ${clientIP} ${new Date()}`;

    console.log(`[${req.correlationId}] ${msg}`)

    if (process.env.APPINSIGHTS_INSTRUMENTATIONKEY) {
        AppInsightsClient.trackPageView();
        AppInsightsClient.trackTrace({ message: `[${req.correlationId}] ${msg}` })
        AppInsightsClient.flush();
    } else {
        msg += ' AppInsights not configured';
    }

    res.send(`${msg}`)
})

app.get('/', function (req, res) {

    const clientIP = req.headers['x-forwarded-for'];
    const msg = `root route ${os.hostname()} ${clientIP} ${new Date()}`

    console.log(`[${req.correlationId}] ${msg}`)

    res.send(msg)

})
app.listen(3000, function () {
    console.log(`Hello world app listening on port 3000! ${os.hostname()}`)
})
