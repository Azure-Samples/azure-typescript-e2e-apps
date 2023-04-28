import express from 'express';
import { swaggerUi, swaggerSpec } from './swagger';

// App route to database
import person from './routes/person';

const port = process.env.PORT || 3000;

const app = express();

// Swagger explorer route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// User route
app.use('/persons', person)

// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});