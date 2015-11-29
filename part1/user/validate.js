'use strict';

var Ajv = require('ajv');

var userData = require('./data');
var userSchema = require('./schema');
var improvedUserSchema = require('./schema_improved');

var ajv = Ajv({allErrors: true});

var validate = ajv.compile(userSchema);
test(validate);

var validate2 = ajv.compile(improvedUserSchema);
test(validate2);


function test(validate) {
    var valid = validate(userData);

    if (valid) {
      console.log('User data is valid!');
    } else {
      console.log('User data is INVALID!');
      console.log(validate.errors);
    }    
}
