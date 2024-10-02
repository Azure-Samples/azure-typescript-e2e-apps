import express from 'express';
import { join, dirname } from 'path';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const router = express.Router();
router.use(express.json());

const pathToSpec = join(__dirname, './openApiSchema.yml');
const openApiSpec = yaml.load(pathToSpec);

router.use('/', swaggerUi.serve, swaggerUi.setup(openApiSpec));

export default router;
