export function ruleLeveler(level: "error" | "warn" | "off") {
  return {
    "@mkusaka/prefer-type-annotate/array-pattern": level,
    "@mkusaka/prefer-type-annotate/arrow-function-expression": level,
    "@mkusaka/prefer-type-annotate/class-property": level,
    "@mkusaka/prefer-type-annotate/function-declaration": level,
    "@mkusaka/prefer-type-annotate/function-expression": level,
    "@mkusaka/prefer-type-annotate/object-pattern": level,
    "@mkusaka/prefer-type-annotate/ts-as-expression": level,
    "@mkusaka/prefer-type-annotate/ts-index-signature": level,
    "@mkusaka/prefer-type-annotate/ts-property-signature": level,
    "@mkusaka/prefer-type-annotate/variable-declarator": level,
  };
}

const allErrorRules = ruleLeveler("error");
const allWarnRules = ruleLeveler("warn");

export { allErrorRules, allWarnRules };
