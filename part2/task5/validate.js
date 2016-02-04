'use strict';

var Ajv = require('ajv');
var assert = require('assert');

var objects = require('./objects');

var schema = process.env.NODE_ENV == 'test'
               ? require('../answers/task5_schema')
               : require('./schema');

var ajv = Ajv({allErrors: true, v5: true});
var validate = ajv.compile(schema);

objects.valid.forEach(function (data) {
    assert(validate(data), 'should be valid: ' + JSON.stringify(data));
});

objects.invalid.forEach(function (data) {
    assert(validate(data) === false, 'should have failed: ' + data.reason);
});


console.log('You\'ve done task 5!');
