import { ESLintUtils, TSESTree, createRule, isTypeAnyType } from "../utils";

export const arrayPattern = createRule({
  name: "array-pattern",
  meta: {
    type: "suggestion",
    docs: {
      description: "",
      category: "Best Practices",
      recommended: false,
      requiresTypeChecking: true,
    },
    messages: {
      ArrayPattern:
        "Please annotate this array with the correct one. This array is inferred as any type.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const { program, esTreeNodeToTSNodeMap } = ESLintUtils.getParserServices(
      context
    );
    function report(location: TSESTree.Node, message: "ArrayPattern"): void {
      context.report({
        node: location,
        messageId: message,
      });
    }
    const checker = program.getTypeChecker();

    return {
      ArrayPattern(node): void {
        const esnode = esTreeNodeToTSNodeMap.get(node);
        const arrType = checker.getTypeAtLocation(esnode);
        if (isTypeAnyType(arrType)) {
          report(node, "ArrayPattern");
        }
      },
    };
  },
});
