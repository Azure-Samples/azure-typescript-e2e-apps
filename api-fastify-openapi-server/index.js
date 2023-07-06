'use strict'

const path = require('path')
const AutoLoad = require('@fastify/autoload')


// Pass --options via CLI arguments in command to enable these options.
module.exports.options = {}


module.exports = async function (fastify, opts) {
  /*
    IMPORTANT:
    Place here your custom code!
    Do not touch the following lines
  **/

  // This loads and sets @fastify/swagger
  fastify.register(require('@fastify/swagger'), {})
  fastify.register(require('@fastify/swagger-ui'), {
    // TODO:  set your settings
    routePrefix: '/docs',
    swagger: {
        info: {
            title: 'Persons Documentation',
        },
        basePath: '',
        schemes: ['http', 'https'],
        consumes: ['application/json'],
        produces: ['application/json'],
        tags: [{
            name: 'Person',
            description: 'Person\'s API'
        }, ],
        yaml: path.join(__dirname, 'openApiSchema.yaml')
    },
    uiConfig: {
        docExpansion: 'list', // expand/not all the documentations none|list|full
        deepLinking: true,
        defaultModelsExpandDepth: 1,
        syntaxHighlight: {
          activate: true,
          theme: 'agate'
        },
        tryItOutEnabled: true,
    },
    uiHooks: {
        onRequest: function(request, reply, next) {
            next()
        },
        preHandler: function(request, reply, next) {
            next()
        }
    },
    staticCSP: false,
    transformStaticCSP: (header) => header,
    exposeRoute: false
  })

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts)
  })

  // This loads and sets fastify/cors
  fastify.register(require('@fastify/cors'), {
    // TODO:  enable CORS as as your needs
    origin: ['http://localhost:8080', 'http://127.0.0.1:8080', 'http://localhost:3000'],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  })

  // Executes Swagger
  fastify.ready(err => {
    if (err) throw err
    fastify.swagger()
  })
}