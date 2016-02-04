'use strict';


module.exports = function(ajv) {
    // this function should add select keyword to ajv instance
    ajv.addKeyword('select', { macro: selectMacro });
};


function selectMacro(schema) {    
    // this function should return the schema equivalent to "select" keyword schema
}
