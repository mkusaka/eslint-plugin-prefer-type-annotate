import { ESLintUtils, TSESTree, createRule, isTypeAnyType } from "../utils";

export const objectPattern = createRule({
  name: "object-pattern",
  meta: {
    type: "suggestion",
    docs: {
      description: "",
      category: "Best Practices",
      recommended: false,
      requiresTypeChecking: true,
    },
    messages: {
      ObjectPattern:
        "Please annotate this object with the correct one. This object is inferred as any type.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const { program, esTreeNodeToTSNodeMap } = ESLintUtils.getParserServices(
      context
    );
    function report(location: TSESTree.Node, message: "ObjectPattern"): void {
      context.report({
        node: location,
        messageId: message,
      });
    }
    const checker = program.getTypeChecker();

    return {
      ObjectPattern(node): void {
        const esnode = esTreeNodeToTSNodeMap.get(node);
        const declareType = checker.getTypeAtLocation(esnode);
        if (isTypeAnyType(declareType)) {
          report(node, "ObjectPattern");
        }
      },
    };
  },
});
