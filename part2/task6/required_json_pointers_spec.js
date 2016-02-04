'use strict';

var Ajv = require('ajv');
var ajv = Ajv({ v5: true, allErrors: true });
var assert = require('assert');

require('./json_pointers')(ajv);

var schema = {
  "allOf": [
    { "requiredJsonPointers": [ "0" ] },
    { "requiredJsonPointers": [ "0/foo" ] },
    { "requiredJsonPointers": [ "0/foo/bar" ] },
    { "requiredJsonPointers": [ "0/foo/bar/0" ] },
    { "requiredJsonPointers": [ "0/foo/bar/1" ] },
    { "requiredJsonPointers": [ "0/foo/bar/2" ] },
    { "requiredJsonPointers": [ "0/foo/bar/0/baz" ] },
    { "requiredJsonPointers": [ "0/foo/bar/1/bax" ] },
    { "requiredJsonPointers": [ "0/foo/bar/2/foo~0" ] },
    { "requiredJsonPointers": [ "0/foo/bar/2/foo~0/~1bar" ] }
  ]
};

var validData = {
  "foo": {
    "bar": [
      {
        "baz": 1
      },
      {
        "bax": "abc"
      },
      {
        "foo~": {
          "/bar": true
        }
      }
    ]
  }
};

var invalidData = {
  "foo": {
    "bar": [
      {},
      {},
      {
        "foo~": {}
      }
    ]
  }
};

var validate = ajv.compile(schema);

assert(validate(validData));

assert(validate(invalidData) === false);
assert(validate.errors.length == 3);
