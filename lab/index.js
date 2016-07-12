'use strict';

const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const server = require('../src/');
let counterStore = require('../src/counterStore');
const expect = Code.expect;

lab.experiment('counter', () => {
  lab.test('GET / root route should be forbidden', (done) => {
    server.inject({
      method: "GET",
      url: "/"
    }, function(response) {
      expect(response.statusCode).to.equal(403);
      done();
    });
  });

  lab.test('GET /counter get the initial counter value', (done) => {
    server.inject({
      method: "GET",
      url: "/counter"
    }, function(response) {
      let result = response.result;
      expect(response.statusCode).to.equal(200);
      expect(result).to.be.an.object();
      expect(result).to.contain('counter');
      expect(result.counter).to.be.a.number();
      expect(result.counter).to.equal(0);
      done();
    });
  });

  lab.test('POST /counter sets the counter value', (done) => {
    let counter = 50;
    server.inject({
      method: "POST",
      url: "/counter",
      payload: {
        counter: counter
      }
    }, function(response) {
      let result = response.result;
      expect(response.statusCode).to.equal(200);
      expect(result).to.contain('counter');
      expect(result.counter).to.be.a.number();
      expect(result.counter).to.equal(counter);
      done();
    });
  });

  lab.test('POST /counter trigger an error if counter > 1000', (done) => {
    let counter = 1002;
    server.inject({
      method: "POST",
      url: "/counter",
      payload: {
        counter: counter
      }
    }, function(response) {
      expect(response.statusCode).to.equal(400);
      done();
    });
  });

  lab.test('POST /counter trigger an error if counter < 0', (done) => {
    let counter = -2;
    server.inject({
      method: "POST",
      url: "/counter",
      payload: {
        counter: counter
      }
    }, function(response) {
      expect(response.statusCode).to.equal(400);
      done();
    });
  });

  lab.test('POST /counter trigger an error if counter is not a number', (done) => {
    let counter = 'zero';
    server.inject({
      method: "POST",
      url: "/counter",
      payload: {
        counter: counter
      }
    }, function(response) {
      expect(response.statusCode).to.equal(400);
      done();
    });
  });
  lab.test('PUT /counter/increment increment the counter value', (done) => {
    counterStore.counter = 0;
    let initialCounter = counterStore.counter;
    server.inject({
      method: "PUT",
      url: "/counter/increment",
    }, function(response) {
      let result = response.result;
      expect(response.statusCode).to.equal(200);
      expect(result).to.be.an.object();
      expect(result).to.contain('counter');
      expect(result.counter).to.be.a.number();
      expect(result.counter).to.equal(initialCounter + 1);
      done();
    });
  });

  lab.test('PUT /counter/increment trigger an error if counter > 1000', (done) => {
    counterStore.counter = 1000;
    server.inject({
      method: "PUT",
      url: "/counter/increment",
    }, function(response) {
      expect(response.statusCode).to.equal(400);
      done();
    });
  });
  lab.test('PUT /counter/decrement decrement the counter value', (done) => {
    counterStore.counter = 1000;
    let initialCounter = counterStore.counter;
    server.inject({
      method: "PUT",
      url: "/counter/decrement",
    }, function(response) {
      let result = response.result;
      expect(response.statusCode).to.equal(200);
      expect(result).to.be.an.object();
      expect(result).to.contain('counter');
      expect(result.counter).to.be.a.number();
      expect(result.counter).to.equal(initialCounter - 1);
      done();
    });
  });

  lab.test('PUT /counter/decrement trigger an error if counter < 0', (done) => {
    counterStore.counter = 0;
    server.inject({
      method: "PUT",
      url: "/counter/decrement",
    }, function(response) {
      expect(response.statusCode).to.equal(400);
      done();
    });
  });
});

lab.experiment('kvstore', () => {

});