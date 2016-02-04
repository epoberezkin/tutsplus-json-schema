'use strict';

var Ajv = require('ajv');
var assert = require('assert');

var data = require('./data');

var switchSchema = require('./switch_schema');
var noSwitchSchema = process.env.NODE_ENV == 'test'
                       ? require('../answers/task4_no_switch_schema')
                       : require('./no_switch_schema');

var ajvV5 = Ajv({allErrors: true, v5: true});
var switchValidate = ajvV5.compile(switchSchema);

var ajv = Ajv({allErrors: true});
var noSwitchValidate = ajvV5.compile(noSwitchSchema);

test(switchValidate);
test(noSwitchValidate);

console.log('You\'ve done task 4!');


function test(validate) {
    data.valid.forEach(function (value) {
        var valid = validate(value);
        if (!valid) console.log(validate.errors);
        assert(valid, 'value should be valid ' + value);
    });

    data.invalid.forEach(function (value) {
        assert(validate(value) === false, 'value should be invalid ' + value);
    });
}
