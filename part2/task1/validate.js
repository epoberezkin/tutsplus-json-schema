'use strict';

var Ajv = require('ajv');
var assert = require('assert');

var userData = require('./data');
var invalidUserData = require('./invalid_data');

var userSchema = process.env.NODE_ENV == 'test'
                   ? require('../answers/task1_user')
                   : require('./user');
var connectionSchema = process.env.NODE_ENV == 'test'
                       ? require('../answers/task1_connection')
                       : require('./connection');

var ajv = Ajv({allErrors: true});
ajv.addSchema(userSchema);
ajv.addSchema(connectionSchema);


var validate = ajv.getSchema('http://mynet.com/schemas/user.json#');
assert(validate(userData) === true, 'data.json should be valid');
assert(validate(invalidUserData) === false, 'invalid_data.json should be invalid');

console.log('You\'ve done task 1!');
