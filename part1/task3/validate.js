'use strict';

var Ajv = require('ajv');
var assert = require('assert');

var dateArgsSchema = process.env.NODE_ENV == 'test'
                      ? require('../answers/task3_date_args_schema')
                      : require('./date_args_schema');

var ajv = Ajv();
var validate = ajv.compile(dateArgsSchema);

var validArgs = require('./valid_args');
var invalidArgs = require('./invalid_args');

validArgs.forEach(function (args, i) {
  assert(validate(args), '#' + i + ' should be valid: ' + JSON.stringify(args));
});

invalidArgs.forEach(function (args, i) {
  assert(!validate(args), '#' + i + ' should be invalid: ' + JSON.stringify(args));
});

console.log('You\'ve done task 3!');
