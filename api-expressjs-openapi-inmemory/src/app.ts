import express, {Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

import person from './routes/person';

const app = express();

// Swagger definition
const swaggerDefinition = {
  swagger: '2.0',
  info: {
    title: 'Users API',
    version: '1.0.0',
    description: 'API for managing users',
  },
  basePath: '/',
};

const pathToSwagger = path.join(__dirname, './swagger.yml');
console.log(pathToSwagger);

// Options for the swagger-jsdoc middleware
const options = {
  swaggerDefinition,
  apis: [pathToSwagger], // Replace this with the path to your Swagger specification file
};

// Initialize swagger-jsdoc middleware
const swaggerSpec = swaggerJsdoc(options);

// Serve the Swagger UI as home page
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Person route
app.use('/users', person)

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});