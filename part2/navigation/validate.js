'use strict';

if (process.env.NODE_ENV != 'test') return;

var Ajv = require('ajv');
var assert = require('assert');

var navData = require('./data');

var ajv = Ajv({
    v5: true,
    allErrors: true,
    verbose: true,
    schemas: [
        require('./navigation'),
        require('./page'),
        require('./defs')
    ]
});


var validate = ajv.getSchema('http://mynet.com/schemas/navigation.json#');
assert(test(validate));

console.log('Navigation schema OK');


function test(validate) {
    var valid = validate(navData);

    if (valid) {
      console.log('Navigation data is valid!');
    } else {
      console.log('Navigation data is INVALID!');
      console.log(validate.errors);
    }

    return valid;
}
