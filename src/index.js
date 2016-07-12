'use strict';

const Hapi = require('hapi');
const Joi = require('joi');
const Boom = require('boom');
const PORT = process.env.PORT || 3000;

const server = new Hapi.Server();
server.connection({port: PORT});

let counterStore = require('./counterStore');

server.route({
  method: 'GET',
  path: '/',
  handler: function (request, reply) {
    reply(Boom.forbidden());
  },
});

server.route({
  method: 'GET',
  path: '/counter',
  handler: function (request, reply) {
    reply(counterStore);
  },
  config: {
    validate: {
      query: Joi.object().keys({})
    }
  }
 });

server.route({
  method: 'POST',
  path: '/counter',
  config: {
    handler: function (request, reply) {
      counterStore.counter = request.payload.counter;
      reply(counterStore);
    },
    validate: {
      payload: {
        counter: Joi.number().integer().min(0).max(1000)
      }
    }
  }
});

server.route({
  method: 'PUT',
  path: '/counter/increment',
  handler: function (request, reply) {
    counterStore.counter++;
    if(counterStore.counter > 1000) {
      return reply(Boom.badRequest("counter must be below 1000"));
    }
    reply(counterStore);

  }
});

server.route({
  method: 'PUT',
  path: '/counter/decrement',
  handler: function (request, reply) {
    counterStore.counter--;
    if(counterStore.counter < 0) {
      return reply(Boom.badRequest("counter must be greater than or equal to 0"));
    }
    reply(counterStore);
  }
});

if(!module.parent) {
  server.start((err) => {
    if(err) {
      throw err;
    }

    console.log('Server running at:', server.info.uri);
  });
}

module.exports = server;