'use strict';

const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const server = require("../src/");

const expect = Code.expect;

lab.experiment('GET /', () => {
  lab.test('root route should be forbidden', (done) => {
    server.inject({
      method: "GET",
      url: "/"
    }, function(response) {
      expect(response.statusCode).to.equal(403);
      done();
    });
  });
});

lab.experiment('GET /counter', () => {

  lab.test('get the initial counter value', (done) => {
    server.inject({
      method: "GET",
      url: "/counter"
    }, function(response) {
      let result = response.result;
      expect(response.statusCode).to.equal(200);
      expect(result).to.be.an.object();
      expect(result).to.contain('counter');
      expect(result.counter).to.be.a.number();
      done();
    });
  });

});

lab.experiment('POST /counter', () => {

  lab.test('sets the counter value', (done) => {
    done();
  });

  lab.test('trigger an error if counter > 1000 or counter < 0', (done) => {
    done();
  });

});

lab.experiment('PUT /counter/increment', () => {

  lab.test('increment the counter value', (done) => {

  });

  lab.test('trigger an error if counter > 1000', (done) => {
  })
});

lab.experiment('PUT /counter/decrement', () => {

});