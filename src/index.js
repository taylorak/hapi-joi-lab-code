'use strict';

const Hapi = require('hapi');
const PORT = process.env.PORT || 3000

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

server.start((err) => {
  if(err) {
    throw err;
  }

  console.log('Server running at:', server.info.uri);
});