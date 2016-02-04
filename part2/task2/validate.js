'use strict';

var jsonPointer = require('json-pointer')
var assert = require('assert');

var fileSystem = require('./file_system.json');
var pointers = process.env.NODE_ENV == 'test'
                ? require('../answers/task2_json_pointers')
                : require('./json_pointers');


assert.equal(jsonPointer.get(fileSystem, pointers.app_word_size), 1725058307);
assert.equal(jsonPointer.get(fileSystem, pointers.my_story_size), 30476);
assert.equal(jsonPointer.get(fileSystem, pointers.rtf_editor_2), 'TextEdit');

console.log('You\'ve done task 2!');
