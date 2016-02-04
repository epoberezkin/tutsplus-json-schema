'use strict';

var Ajv = require('ajv');
var ajv = Ajv({ v5: true, allErrors: true });
var assert = require('assert');

require('./json_pointers')(ajv);

var schema = {
  "jsonPointers": {
    "0": { "type": "object", "required": ["foo"] },
    "0/foo": { "type": "object", "required": ["bar"] },
    "0/foo/bar": { "type": "array", "minItems": 3, "maxItems": 3 },
    "0/foo/bar/0": { "type": "object", "required": ["baz"] },
    "0/foo/bar/1": { "type": "object", "required": ["bax"] },
    "0/foo/bar/2": { "type": "object", "required": ["foo~"] },
    "0/foo/bar/0/baz": { "type": "integer", "constant": 1 },
    "0/foo/bar/1/bax": { "type": "string", "constant": "abc" },
    "0/foo/bar/2/foo~0": { "type": "object", "required": ["/bar"] },
    "0/foo/bar/2/foo~0/~1bar": { "type": "boolean", "constant": true }
  }
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
      {
        "baz": "abc"
      },
      {
        "bax": 1
      },
      {
        "foo~": {
          "/bar": false
        }
      }
    ]
  }
};

var validate = ajv.compile(schema);

assert(validate(validData));

assert(validate(invalidData) === false);
assert(validate.errors.length == 6);
