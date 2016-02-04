'use strict';

var Ajv = require('ajv');
var ajv = Ajv({ v5: true, allErrors: true });
var assert = require('assert');

require('./json_pointers')(ajv);

var selectKeyword = process.env.NODE_ENV == 'test'
                       ? require('../answers/task6_select_keyword')
                       : require('./select_keyword');
selectKeyword(ajv);

var schema = {
  "select": {
    "selector": "0/dataType",
    "cases": [
      { "case": "integer", "schema": { "properties": { "data": { "type": "integer" } } } },
      { "case": "string",  "schema": { "properties": { "data": { "type": "string" } } } }
    ],
    "otherwise": { "properties": { "data": { "type": "object" } } }
  }
};

var validate = ajv.compile(schema);

assert(validate({ "dataType": "integer", "data": 1 }));
assert(validate({ "dataType": "string", "data": "foo" }));
assert(validate({ "data": {} }));
assert(validate({ "dataType": "integer", "data": "foo" }) === false);
assert(validate({ "dataType": "string", "data": 1 }) === false);
assert(validate({ "data": 1 }) === false);


var schema2 = {
  "select": {
    "selector": "0/dataType",
    "cases": [
      { "case": "integer", "schema": { "properties": { "data": { "type": "integer" } } } },
      { "case": "character", "schema": { "properties": { "data": { "maxLength": 1, "minLength": 1 } } }, continue: true },
      { "case": "string",  "schema": { "properties": { "data": { "type": "string" } } } }
    ]
  }
};

var validate2 = ajv.compile(schema2);

assert(validate2({ "dataType": "integer", "data": 1 }));
assert(validate2({ "dataType": "string", "data": "foo" }));
assert(validate2({ "dataType": "character", "data": "f" }));
assert(validate2({ "data": {} }));
assert(validate2({ "data": 1 }));
assert(validate2({ "dataType": "integer", "data": "foo" }) === false);
assert(validate2({ "dataType": "string", "data": 1 }) === false);
assert(validate2({ "dataType": "character", "data": "foo" }) === false);
assert(validate2({ "dataType": "character", "data": 1 }) === false);

console.log('You\'ve done task 6!');


try {
  var schema2 = {
    "select": {
      "selector": "0/dataType",
      "cases": {
        "integer": { "properties": { "data": { "type": "integer" } } },
        "string": { "properties": { "data": { "type": "string" } } }
      }
    }
  };

  var validate2 = ajv.compile(schema2);

  assert(validate2({ "dataType": "integer", "data": 1 }));
  assert(validate2({ "dataType": "string", "data": "foo" }));
  assert(validate2({ "data": {} }));
  assert(validate2({ "data": 1 }));
  assert(validate2({ "dataType": "integer", "data": "foo" }) === false);
  assert(validate2({ "dataType": "string", "data": 1 }) === false);  

  console.log('You\'ve got the bonus 1 too!');
} catch(e) {
  console.log('Now try getting the bonus 1')
}
