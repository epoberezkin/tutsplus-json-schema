'use strict';

if (process.env.NODE_ENV != 'test') return;

var Ajv = require('ajv');
var assert = require('assert');

var userData = require('./data');
var userSchema = require('./schema');
var improvedUserSchema = require('./schema_improved');

var ajv = Ajv({allErrors: true});

var validate = ajv.compile(userSchema);
assert(test(validate));

var validate2 = ajv.compile(improvedUserSchema);
assert(test(validate2));

console.log('User schema OK');


function test(validate) {
    var valid = validate(userData);

    if (valid) {
      console.log('User data is valid!');
    } else {
      console.log('User data is INVALID!');
      console.log(validate.errors);
    }

    return valid;
}
