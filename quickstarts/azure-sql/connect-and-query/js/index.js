import express from 'express';

// Import App routes
import person from './person.js';
import openapi from './openapi.js';

const port = process.env.PORT || 3000;

const app = express();

// Connect App routes
app.use('/api-docs', openapi);
app.use('/persons', person);
app.use('*', (_, res) => {
  res.redirect('/api-docs');
});

// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
