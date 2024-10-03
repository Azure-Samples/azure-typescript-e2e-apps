import express, { Router } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';

// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router: Router = express.Router();
router.use(express.json());

const pathToSpec = path.join(__dirname, '../openApiSchema.yml');
const openApiSpec = yaml.load(pathToSpec);

router.use('/', swaggerUi.serve, swaggerUi.setup(openApiSpec));

export default router;
