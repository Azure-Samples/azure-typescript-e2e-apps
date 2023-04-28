const express = require('express');

// Import App routes
const person = require('./route_person');
const openapi = require('./route_openapi');

const port = process.env.PORT || 3000;

const app = express();

// Connect App routes
app.use('/api-docs', openapi);
app.use('/persons', person)
app.use('*', (_, res) => {
  res.redirect('/api-docs');
})

// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});