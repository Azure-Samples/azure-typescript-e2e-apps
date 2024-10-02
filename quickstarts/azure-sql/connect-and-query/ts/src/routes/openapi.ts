import express, { Router } from "express";
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';

const router: Router = express.Router();
router.use(express.json());

const pathToSpec = path.join(__dirname, '../openApiSchema.yml');
const openApiSpec = yaml.load(pathToSpec);

router.use('/', swaggerUi.serve, swaggerUi.setup(openApiSpec));

export default router;