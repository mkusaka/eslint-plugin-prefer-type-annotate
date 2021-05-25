import { arrayPattern } from "./rules/array-pattern";
import { arrowFunctionExpression } from "./rules/arrow-function-expression";
import { classProperty } from "./rules/class-property";
import { functionDeclaration } from "./rules/function-declaration";
import { functionExpression } from "./rules/function-expression";
import { objectPattern } from "./rules/object-pattern";
import { tsAsExpression } from "./rules/ts-as-expression";
import { tsIndexSignature } from "./rules/ts-index-signature";
import { tsPropertySignature } from "./rules/ts-property-signature";
import { variableDeclarator } from "./rules/variable-declarator";
import { tsCallSignatureDeclaration } from "./rules/ts-call-signature-declaration";

import { allErrorRules, allWarnRules } from "./configs/all";

export = {
  rules: {
    "array-pattern": arrayPattern,
    "arrow-function-expression": arrowFunctionExpression,
    "class-property": classProperty,
    "function-declaration": functionDeclaration,
    "function-expression": functionExpression,
    "object-pattern": objectPattern,
    "ts-as-expression": tsAsExpression,
    "ts-index-signature": tsIndexSignature,
    "ts-property-signature": tsPropertySignature,
    "variable-declarator": variableDeclarator,
    "ts-call-signature-declaration": tsCallSignatureDeclaration,
  },
  configs: {
    "all-error-rules": allErrorRules,
    "all-warn-rules": allWarnRules,
  },
};
