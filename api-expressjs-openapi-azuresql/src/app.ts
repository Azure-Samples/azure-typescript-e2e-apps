import express from 'express';
import { swaggerUi, swaggerSpec } from './swagger';

// App route to database
import person from './routes/person';

const port = process.env.PORT || 3000;

const app = express();

// Swagger explorer route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Person route
app.use('/users', person)

// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});