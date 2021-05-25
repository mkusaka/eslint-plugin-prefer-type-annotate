"use strict";
exports.__esModule = true;
exports.allWarnRules = exports.allErrorRules = exports.ruleLeveler = void 0;
function ruleLeveler(level) {
    return {
        rules: {
            "@mkusaka/prefer-type-annotate/array-pattern": level,
            "@mkusaka/prefer-type-annotate/arrow-function-expression": level,
            "@mkusaka/prefer-type-annotate/class-property": level,
            "@mkusaka/prefer-type-annotate/function-declaration": level,
            "@mkusaka/prefer-type-annotate/function-expression": level,
            "@mkusaka/prefer-type-annotate/object-pattern": level,
            "@mkusaka/prefer-type-annotate/ts-as-expression": level,
            "@mkusaka/prefer-type-annotate/ts-index-signature": level,
            "@mkusaka/prefer-type-annotate/ts-property-signature": level,
            "@mkusaka/prefer-type-annotate/variable-declarator": level
        }
    };
}
exports.ruleLeveler = ruleLeveler;
var allErrorRules = ruleLeveler("error");
exports.allErrorRules = allErrorRules;
var allWarnRules = ruleLeveler("warn");
exports.allWarnRules = allWarnRules;
