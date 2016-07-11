'use strict';

const Hapi = require('hapi');
const Joi = require('joi');
const PORT = process.env.PORT || 3000;

const server = new Hapi.Server();
server.connection({port: PORT});

let counterStore = { counter: 0 };

server.route({
  method: 'GET',
  path: '/',
  handler: function (request, reply) {
    reply(counterStore);
  }
});

server.route({
  method: 'GET',
  path: '/counter',
  handler: function (request, reply) {
    reply(counterStore);
  }
});

server.route({
  method: 'POST',
  path: '/counter',
  handler: function (request, reply) {
    counterStore.counter = request.payload.counter;
    reply(counterStore);
  }
});

server.route({
  method: 'PUT',
  path: '/counter/increment',
  handler: function (request, reply) {
    counterStore.counter++;
    reply(counterStore);
  }
});

server.route({
  method: 'PUT',
  path: '/counter/decrement',
  handler: function (request, reply) {
    counterStore.counter--;
    reply(counterStore);
  }
});

server.start((err) => {
  if(err) {
    throw err;
  }

  console.log('Server running at:', server.info.uri);
});