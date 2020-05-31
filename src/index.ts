import { noLiteralRule } from "./rules/no-literal";
import { preferTypeAnnotation } from "./rules/prefer-type-annotation";

export = {
  rules: {
    "no-literal": noLiteralRule,
    "prefer-type-annotate": preferTypeAnnotation,
  },
};
