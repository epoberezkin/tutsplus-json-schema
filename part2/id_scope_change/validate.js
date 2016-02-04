'use strict';

if (process.env.NODE_ENV != 'test') return;

var Ajv = require('ajv');
var assert = require('assert');

var data = require('./data');
var schema = require('./schema');

var ajv = Ajv({ allErrors: true, verbose: true });


var validate = ajv.compile(schema);
assert(test(validate));

console.log('Scope change schema OK');


function test(validate) {
    var valid = validate(data);

    if (valid) {
      console.log('Scope change data is valid!');
    } else {
      console.log('Scope change data is INVALID!');
      console.log(validate.errors);
    }

    return valid;
}
