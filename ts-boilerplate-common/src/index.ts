import fastifyStatic from '@fastify/static'
import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import path from 'path'

const fastify = Fastify({
  logger: true
})

const publicPath = path.join(__dirname, 'public')
console.log('publicPath', publicPath)

// Register the fastify-static plugin
fastify.register(fastifyStatic, {
  root: publicPath,
  prefix: '/public',
})

// Register CORS plugin
fastify.register(require('@fastify/cors'), {
  origin: '*', // Allow all origins
})
const routes = (fastify: FastifyInstance, _: any, done: () => void) => {

  // JSON data
  fastify.post('/api', (request: FastifyRequest, reply: FastifyReply) => {
    console.log(`************           API post request received: ${JSON.stringify(request.body)}`)
    const data = request.body
    reply.code(200).send({ received: data })
  });

  // root
  fastify.get('/', (_: FastifyRequest, reply: FastifyReply) => {
    console.log(`************           ROOT post request received`)
    reply.sendFile('index.html')
  });

  done();
}

fastify.register(routes);

/**
 * Run the server!
 */
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' })
    console.log(`server listening on 3000`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()