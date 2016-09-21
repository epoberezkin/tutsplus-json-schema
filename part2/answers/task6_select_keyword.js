'use strict';


module.exports = function(ajv) {
    // this function should add select keyword to ajv instance
    ajv.addKeyword('select', { macro: selectMacro });
};


function selectMacro(schema) {    
    var selector = schema.selector;
    var cases = schema.cases;
    var switchSchema = [];

    var defaultSchema = schema.otherwise;
    var checkSelectorSchema = { "requiredJsonPointers": [ selector ] };
    switchSchema.push({
        "if": { "not": checkSelectorSchema },
        "then": defaultSchema || true
    });

    if (Array.isArray(cases)) {
        for (var i=0; i<cases.length; i++) {
            addCase(cases[i], i);
        }
    } else {
        checkSelectorSchema.jsonPointers = {};
        checkSelectorSchema.jsonPointers[selector] = { "type": "string" };

        for (var value in cases) {
            addCase({
                case: value,
                schema: cases[value]
            });
        }
    }
    return { "switch": switchSchema };


    function addCase(selectCase, index) {
        var selectorSchema = {};
        selectorSchema[selector] = { "constant": selectCase.case };

        var fallThrough = selectCase.continue === true;

        var caseSchema = {
            "if": { "jsonPointers": selectorSchema },
            "then": fallThrough
                    ? { "allOf": [ selectCase.schema ] }
                    : selectCase.schema
        };
        while (fallThrough && ++index < cases.length) {
            caseSchema.then.allOf.push(cases[index].schema);
            fallThrough = cases[index].continue === true
        }

        switchSchema.push(caseSchema);
    }
}
