'use strict';

var Ajv = require('ajv');
var assert = require('assert');

var invalidUserData = process.env.NODE_ENV == 'test'
                      ? require('../answers/task5_invalid_user')
                      : require('./invalid_user');

var userSchema = require('../user/schema');

var ajv = Ajv({allErrors: true});

var validate = ajv.compile(userSchema);
var valid = validate(invalidUserData);
console.log(valid ? 'valid!' : 'invalid!');
if (!valid) {
  console.log(validate.errors.length + ' errors');
  // console.log(validate.errors);
}

assert(validate.errors.length >= 8);
console.log('You\'ve done task 5!');
