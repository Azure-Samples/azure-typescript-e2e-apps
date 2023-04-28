import express from 'express';
import { swaggerUi, swaggerSpec } from './swagger';

// App route to database
import user from './routes/user';

const port = process.env.PORT || 3000;

const app = express();

// Swagger explorer route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// User route
app.use('/users', user)

// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});