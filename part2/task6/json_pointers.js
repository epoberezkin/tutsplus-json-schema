'use strict';


module.exports = function(ajv) {
  ajv.addKeyword('jsonPointers', { type: ['array', 'object'], macro: macroJsonPointers });
  ajv.addKeyword('requiredJsonPointers', { type: ['array', 'object'], inline: inlineRequiredJsonPointers });
};


function macroJsonPointers(schema, parentSchema) {
  var pointerSchemas = [];
  for (var pointer in schema)
    pointerSchemas.push(getSchema(pointer, schema[pointer]));
  return { "allOf": pointerSchemas };
}


function inlineRequiredJsonPointers(it, keyword, schema) {
  var expr = '';
  for (var i=0; i<schema.length; i++) {
    if (i) expr += ' && ';
    expr += '(' + getData(schema[i], it.dataLvl, it.dataPathArr) + ' !== undefined)';
  }
  return expr;
}


function getData($data, lvl, paths) {
  var parsed = parseJsonPointer($data, lvl);
  var up = parsed.up;
  var jsonPointer = parsed.jsonPointer;
  if (jsonPointer == '#') {
    return paths[lvl - up];
  } else {
    var data = 'data' + ((lvl - up) || '');
    if (!jsonPointer) return data;

    var expr = data;
    var segments = jsonPointer.split('/');
    for (var i=0; i<segments.length; i++) {
      var segment = segments[i];
      if (segment) {
        data += getProperty(unescapeJsonPointer(segment));
        expr += ' && ' + data;
      }
    }
    return expr;
  }
}


function getSchema(pointer, schema) {
  var parsed = parseJsonPointer(pointer, 0);
  if (!parsed.jsonPointer) return schema;

  var segments = parsed.jsonPointer.split('/');
  var rootSchema = {};
  var pointerSchema = rootSchema;
  for (var i=0; i<segments.length; i++) {
    var segment = segments[i];
    if (!segment) continue;
    var isLast = i == segments.length - 1;
    segment = unescapeJsonPointer(segment);
    if (/[0-9]+/.test(segment)) {
      // item
      segment = +segment;
      var items = pointerSchema.items = [];
      while (segment--) items.push({});
      pointerSchema = isLast ? schema : {};
      items.push(pointerSchema);
    } else {
      // property
      var properties = pointerSchema.properties = {};
      pointerSchema = isLast ? schema : {};
      properties[segment] = pointerSchema;
    }
  }
  return rootSchema;
}


var RELATIVE_JSON_POINTER = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function parseJsonPointer(pointer, lvl) {
  var matches = pointer.match(RELATIVE_JSON_POINTER);
  if (!matches) throw new Error('Invalid relative JSON-pointer: ' + pointer);
  var up = +matches[1];
  var jsonPointer = matches[2];
  if (jsonPointer == '#') {
    if (up >= lvl) throw new Error('Cannot access property/index ' + up + ' levels up, current level is ' + lvl);
  } else {
    if (up > lvl) throw new Error('Cannot access data ' + up + ' levels up, current level is ' + lvl);
  }
  return {
    up: up,
    jsonPointer: jsonPointer
  };
}


var IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
var SINGLE_QUOTE = /'|\\/g;
function getProperty(key) {
  return typeof key == 'number'
          ? '[' + key + ']'
          : IDENTIFIER.test(key)
            ? '.' + key
            : "['" + key.replace(SINGLE_QUOTE, '\\$&') + "']";
}


function unescapeJsonPointer(str) {
  return str.replace(/~1/g, '/').replace(/~0/g, '~');
}
