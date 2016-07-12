'use strict';

const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const server = require('../src/');
const counterStore = require('../src/counterStore');
const kvstore = require('../src/kvstore');
const expect = Code.expect;

/**
* COUNTER TESTS
**/
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

  lab.test('GET /counter trigger an error when given a querystring', (done) => {
    server.inject({
      method: "GET",
      url: "/counter?hello=world",
    }, function(response) {
      expect(response.statusCode).to.equal(400);
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

/**
* KVSTORE TESTS
**/
lab.experiment.skip('kvstore', () => {

  const good_key = 'good_key';
  const bad_key = 'bad-key';

  const good_string_value = 'good_value';
  const long_string_value = 'long_string_value';

  const good_number_value = 5;
  const bad_number_value = 1005;

  const good_number_array = [good_number_value];
  const bad_number_array = [bad_number_value];

  const good_string_array = [good_string_value];
  const bad_string_array = [long_string_value];

  const good_number_string_array = [good_number_value, good_string_value];

  lab.beforeEach((done) => {
    kvstore = {};
    done();
  });

  lab.test.skip('GET /kvstore get the store', (done) => {
    server.inject({
      method: "GET",
      url: "/kvstore"
    }, function(response) {
      let result = response.result;
      expect(response.status).to.equal(200);
      expect(result).to.be.an.object();
      expect(result).to.be.empty();
      done();
    });
  });

  lab.test.skip('GET /kvstore/:key returns an item with the specified key', (done) => {
    kvstore[good_key] = good_string_value;
    server.inject({
      method: "GET",
      url: `/kvstore/${good_key}`,
    }, function(response) {
      let result = response.result;
      expect(response.status).to.equal(200);
      expect(result).to.be.an.object();
      expect(result[good_key]).to.equal(good_string_value);
      done();
    });
  });

  lab.test.skip('GET /kvstore/:key returns 404 if the key does not exist', (done) => {
    server.inject({
      method: "GET",
      url: `/kvstore/${bad_key}`
    }, function(response) {
      expect(response.status).to.equal(404);
      done();
    });
  });

  lab.test.skip('POST /kvstore/string set a n object with a string value', (done) => {
    server.inject({
      method: "POST",
      url: "/kvstore/string",
      params: {
        key: good_key,
        value: good_string_value
      }
    }, function(response) {
      let result = response.result;
      expect(response.statusCode).to.equal(200);
      expect(result).to.be.an.object();
      expect(result[good_key]).to.equal(good_string_value);
    });
  });

  lab.test.skip('POST /kvstore/string if the key already exists return a 409 error', (done) => {
    kvstore[good_key] = good_string_value;
    server.inject({
      method: "POST",
      url: "/kvstore/string",
      params: {
        key: good_key,
        value: good_string_value
      }
    }, function(response) {
      expect(response.statusCode).to.equal(409);
      done();
    });
  });

  lab.test.skip('POST /kvstore/string trigger error if not a string', (done) => {
    server.inject({
      method: "POST",
      url: "/kvstore/string",
      params: {
        key: good_key,
        value: good_number_value
      }
    }, function(response) {
      expect(response.statusCode).to.equal(400);
      done();
    });
  });

  lab.test.skip('POST /kvstore/string trigger error if max length is more than 10', (done) => {
    server.inject({
      method: "POST",
      url: "/kvstore/string",
      params: {
        key: good_key,
        value: long_string_value
      }
    }, function(response) {
      expect(response.statusCode).to.equal(400);
      done();
    });
  });

  lab.test.skip('POST /kvstore/string key must only contain numbers, letters, underscore, or dashes', (done) => {
    server.inject({
      method: "POST",
      url: "/kvstore/string",
      params: {
        key: bad_key,
        value: good_string_value
      }
    }, function(response) {
      expect(response.statusCode).to.equal(400);
      done();
    });
  });

  lab.test.skip('POST /kvstore/number set a n object with a number value', (done) => {
    server.inject({
      method: "POST",
      url: "/kvstore/number",
      params: {
        key: good_key,
        value: good_number_value
      }
    }, function(response) {
      let result = response.result;
      expect(response.statusCode).to.equal(200);
      expect(result).to.be.an.object();
      expect(result[good_key]).to.equal(good_number_value);
    });
  });

  lab.test.skip('POST /kvstore/number if the key already exists return a 409 error', (done) => {
    kvstore[good_key] = good_number_value;
    server.inject({
      method: "POST",
      url: "/kvstore/number",
      params: {
        key: good_key,
        value: good_number_value
      }
    }, function(response) {
      expect(response.statusCode).to.equal(409);
      done();
    });
  });

  lab.test.skip('POST /kvstore/number trigger error if not a number', (done) => {
    server.inject({
      method: "POST",
      url: "/kvstore/number",
      params: {
        key: good_key,
        value: good_string_value
      }
    }, function(response) {
      expect(response.statusCode).to.equal(400);
      done();
    });
  });

  lab.test.skip('POST /kvstore/number trigger error if number is between 0 and 1000', (done) => {
    server.inject({
      method: "POST",
      url: "/kvstore/number",
      params: {
        key: good_key,
        value: bad_number_value
      }
    }, function(response) {
      expect(response.statusCode).to.equal(400);
      done();
    });
  });

  lab.test.skip('POST /kvstore/number key must only contain numbers, letters, underscore, or dashes', (done) => {
    server.inject({
      method: "POST",
      url: "/kvstore/number",
      params: {
        key: bad_key,
        value: good_number_value
      }
    }, function(response) {
      expect(response.statusCode).to.equal(400);
      done();
    });
  });

  lab.test.skip('POST /kvstore/array/string set an object with a string array', (done) => {
    server.inject({
      method: "POST",
      url: "/kvstore/array/string",
      params: {
        key: good_key,
        value: good_string_array
      }
    }, function(response) {
      let result = response.result;
      expect(response.statusCode).to.equal(200);
      expect(result).to.be.an.object();
      expect(result[good_key]).to.equal(good_string_array);
    });
  });

  lab.test.skip('POST /kvstore/array/string if the key already exists return a 409 error', (done) => {
    kvstore[good_key] = good_string_array;
    server.inject({
      method: "POST",
      url: "/kvstore/array/string",
      params: {
        key: good_key,
        value:good_string_array
      }
    }, function(response) {
      expect(response.statusCode).to.equal(409);
      done();
    });
  });

  lab.test.skip('POST /kvstore/array/string trigger error if not an array of strings', (done) => {
    server.inject({
      method: "POST",
      url: "/kvstore/array/string",
      params: {
        key: good_key,
        value: good_number_array
      }
    }, function(response) {
      expect(response.statusCode).to.equal(400);
      done();
    });
  });

  lab.test.skip('POST /kvstore/array/string trigger error if any string has a length greater than 10', (done) => {
    server.inject({
      method: "POST",
      url: "/kvstore/array/string",
      params: {
        key: good_key,
        value: bad_string_array
      }
    }, function(response) {
      expect(response.statusCode).to.equal(400);
      done();
    });
  });

  lab.test.skip('POST /kvstore/array/string key must only contain numbers, letters, underscore, or dashes', (done) => {
    server.inject({
      method: "POST",
      url: "/kvstore/array/string",
      params: {
        key: bad_key,
        value: good_string_array
      }
    }, function(response) {
      expect(response.statusCode).to.equal(400);
      done();
    });
  });

  lab.test.skip('POST /kvstore/array/number set an object with a number array', (done) => {
    server.inject({
      method: "POST",
      url: "/kvstore/array/number",
      params: {
        key: good_key,
        value: good_number_array
      }
    }, function(response) {
      let result = response.result;
      expect(response.statusCode).to.equal(200);
      expect(result).to.be.an.object();
      expect(result[good_key]).to.equal(good_number_array);
    });
  });

  lab.test.skip('POST /kvstore/array/number if the key already exists return a 409 error', (done) => {
    kvstore[good_key] = good_number_array;
    server.inject({
      method: "POST",
      url: "/kvstore/array/number",
      params: {
        key: good_key,
        value: good_number_array
      }
    }, function(response) {
      expect(response.statusCode).to.equal(409);
      done();
    });
  });

  lab.test.skip('POST /kvstore/array/number trigger error if not an array of numbers ', (done) => {
    server.inject({
      method: "POST",
      url: "/kvstore/array/number",
      params: {
        key: good_key,
        value: good_string_array
      }
    }, function(response) {
      expect(response.statusCode).to.equal(400);
      done();
    });
  });

  lab.test.skip('POST /kvstore/array/number trigger error if the number is not between 0 and 1000', (done) => {
    server.inject({
      method: "POST",
      url: "/kvstore/array/number",
      params: {
        key: good_key,
        value: bad_number_array
      }
    }, function(response) {
      expect(response.statusCode).to.equal(400);
      done();
    });
  });

  lab.test.skip('POST /kvstore/array/number key must only contain numbers, letters, underscore, or dashes', (done) => {
    server.inject({
      method: "POST",
      url: "/kvstore/array/number"
      params: {
        key: bad_key,
        value: bad_number_array
      }
    }, function(response) {
      expect(response.statusCode).to.equal(400);
      done();
    });
  });

  lab.test.skip('POST /kvstore/array/ set an object with a number or string array', (done) => {
    server.inject({
      method: "POST",
      url: "/kvstore/array",
      params: {
        key: good_key,
        value: good_number_string_array
      }
    }, function(response) {
      let result = response.result;
      expect(response.statusCode).to.equal(200);
      expect(result).to.be.an.object();
      expect(result[good_key]).to.equal(good_number_string_array);
    });
  });

  lab.test.skip('POST /kvstore/array if the key already exists return a 409 error', (done) => {
    kvstore[good_key] = good_number_string_array;
    server.inject({
      method: "POST",
      url: "/kvstore/array",
      params: {
        key: good_key,
        value: good_number_string_array
      }
    }, function(response) {
      expect(response.statusCode).to.equal(409);
      done();
    });
  });

  lab.test.skip('POST /kvstore/array trigger error if not an array', (done) => {
    server.inject({
      method: "POST",
      url: "/kvstore/array",
      params: {
        key: good_key,
        value: good_number_value
      }
    }, function(response) {
      expect(response.statusCode).to.equal(400);
      done();
    });
  });

  lab.test.skip('POST /kvstore/array trigger error if the number is not between 0 and 1000', (done) => {
    server.inject({
      method: "POST",
      url: "/kvstore/array",
      params: {
        key: good_key,
        value: bad_number_array
      }
    }, function(response) {
      expect(response.statusCode).to.equal(400);
      done();
    });
  });

  lab.test.skip('POST /kvstore/array trigger error if the string is greater than 10 length', (done) => {
    server.inject({
      method: "POST",
      url: "/kvstore/array",
      params: {
        key: good_key,
        value: bad_string_array
      }
    }, function(response) {
      expect(response.statusCode).to.equal(400);
      done();
    });
  });

  lab.test.skip('POST /kvstore/array key must only contain numbers, letters, underscore, or dashes', (done) => {
    server.inject({
      method: "POST",
      url: "/kvstore/array"
      params: {
        key: bad_key,
        value: good_number_string_array
      }
    }, function(response) {
      expect(response.statusCode).to.equal(400);
      done();
    });
  });
});