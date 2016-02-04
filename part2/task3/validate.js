'use strict';

var Ajv = require('ajv');
var assert = require('assert');

var schema = require('./schema');

var data = process.env.NODE_ENV == 'test'
           ? require('../answers/task3_valid_data')
           : require('./valid_data');

var ajv = Ajv({allErrors: true});
ajv.addSchema(schema);

var validate = ajv.getSchema('http://x.y.z/rootschema.json#');
assert(validate(data) === true, 'valid_data.json should be valid');

console.log('You\'ve done task 3!');
