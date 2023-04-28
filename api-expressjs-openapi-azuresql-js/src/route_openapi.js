const express = require("express");
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');

const router = express.Router();
router.use(express.json());

const pathToSpec = path.join(__dirname, './openApiSchema.yml');
const openApiSpec = yaml.load(pathToSpec);

router.use('/', swaggerUi.serve, swaggerUi.setup(openApiSpec));

module.exports = router;