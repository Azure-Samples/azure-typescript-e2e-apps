'use strict'
let people = [{
    id: 1,
    lastName: 'Doe',
    firstName: 'John',
},
{
    id: 2,
    lastName: 'Smith',
    firstName: 'Alexander',
}];

let PersonSchema = {
    "type": "object",
    "properties": {
      "id": {
        "type": "integer",
        "readOnly": true
      },
      "firstName": {
        "type": "string"
      },
      "lastName": {
        "type": "string"
      }
    }
  }

module.exports = async function(fastify, opts) {

  /* findAll
    GET /persons/
    returns all the users
  **/
  fastify.route({
    url: '/',
    method: ['GET'],
    // request and response schema
    handler: async (request, reply) => {
      return people
    }
  })
  /* findOne
    GET /persons/:id/
    returns a user given their ID
  **/
  fastify.route({
    url: '/:id/',
    method: ['GET'],
    // the function that will handle this request
    handler: async (request, reply) => {
      const { id } = request.params
      const person = people.find((item) => item.id === id)      // finds the person by their ID

      // does person exists?
      if (!person) {
        reply.code(404).send({
          code: 'PERSON_NOT_FOUND',
          message: `The person #${id} not found!`
        })
        return null
      }

      // returns the user
      return user
    }
  })
    /* create
    POST /persons/
    creates a new person
  **/
    fastify.route({
        url: '/',
        method: ['POST'],
        // the function that will handle this request
        handler: async (request, reply) => {
          const data = request.body
          
          data.id = people[people.length - 1].id + 1  // sets new person's id by increasing the lastest one
          people.push(data)
    
          return data
        }
      })
  /* update
    PUT /users/:id/
    updates a user given their ID
  **/
    fastify.route({
        url: '/:id/',
        method: ['PUT'],
        // the function that will handle this request
        handler: async (request, reply) => {
          const { id } = request.params
          let person = people.find((item) => item.id === id)      // finds the person by their ID
    
          if (!person) {
            reply.code(404).send({
              code: 'PERSON_NOT_FOUND',
              message: `The person #${id} not found!`
            })
            return null
          }
    
          // updates the person with the put data
          person = request.body
          person.id = id
          
          return person
        }
      })
  /* deletes
    DELETE /person/:id/
    deletes a person given their ID
  **/
    fastify.route({
        url: '/:id/',
        method: ['DELETE'],
        // the function that will handle this request
        handler: async (request, reply) => {
          const { id } = request.params
          const person = people.find((item) => item.id === id)      // finds the person by their ID
    
          if (!person) {
            reply.code(404).send({
              code: 'PERSON_NOT_FOUND',
              message: `The people #${id} not found!`
            })
            return null
          }
    
          // deletes the given user
          people = people.filter((item) => item.id !== id)
          
          // returns the deleted user
          return person
        }
      })      
}