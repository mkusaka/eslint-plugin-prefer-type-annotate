"use strict";
var array_pattern_1 = require("./rules/array-pattern");
var arrow_function_expression_1 = require("./rules/arrow-function-expression");
var class_property_1 = require("./rules/class-property");
var function_declaration_1 = require("./rules/function-declaration");
var function_expression_1 = require("./rules/function-expression");
var object_pattern_1 = require("./rules/object-pattern");
var ts_as_expression_1 = require("./rules/ts-as-expression");
var ts_index_signature_1 = require("./rules/ts-index-signature");
var ts_property_signature_1 = require("./rules/ts-property-signature");
var variable_declarator_1 = require("./rules/variable-declarator");
var all_1 = require("./configs/all");
module.exports = {
    rules: {
        "array-pattern": array_pattern_1.arrayPattern,
        "arrow-function-expression": arrow_function_expression_1.arrowFunctionExpression,
        "class-property": class_property_1.classProperty,
        "function-declaration": function_declaration_1.functionDeclaration,
        "function-expression": function_expression_1.functionExpression,
        "object-pattern": object_pattern_1.objectPattern,
        "ts-as-expression": ts_as_expression_1.tsAsExpression,
        "ts-index-signature": ts_index_signature_1.tsIndexSignature,
        "ts-property-signature": ts_property_signature_1.tsPropertySignature,
        "variable-declarator": variable_declarator_1.variableDeclarator
    },
    configs: {
        "all-error-rules": all_1.allErrorRules,
        "all-warn-rules": all_1.allWarnRules
    }
};
