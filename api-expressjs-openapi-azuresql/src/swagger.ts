import path from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

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

export { swaggerUi, swaggerSpec };