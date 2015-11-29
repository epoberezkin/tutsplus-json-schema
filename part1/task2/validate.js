'use strict';

var Ajv = require('ajv');
var assert = require('assert');

var humanData = require('./human');
var machineData = require('./machine');
var invalidData = require('./invalid');

var humanMachineSchema = process.env.NODE_ENV == 'test'
                          ? require('../answers/task2_human_machine_schema')
                          : require('./human_machine_schema');

var ajv = Ajv();

var validate = ajv.compile(humanMachineSchema);

assert(validate(humanData));
assert(validate(machineData));
invalidData.forEach(function (data, i) {
  assert(!validate(data), '#' + i + ' should be invalid: ' + JSON.stringify(data));
});

console.log('You\'ve done task 2!');
