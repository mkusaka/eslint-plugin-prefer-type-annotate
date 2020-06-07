import { ESLintUtils, TSESTree } from "@typescript-eslint/experimental-utils";
import ts from "typescript";

function isTypeAnyType({ flags }: ts.Type) {
  return flags === ts.TypeFlags.Any;
}
const createRule = ESLintUtils.RuleCreator((ruleName) => ruleName);

export { createRule, ESLintUtils, TSESTree, isTypeAnyType };
