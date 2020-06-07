import { ESLintUtils, TSESTree, createRule, isTypeAnyType } from "../utils";

export const classProperty = createRule({
  name: "class-property",
  meta: {
    type: "suggestion",
    docs: {
      description: "",
      category: "Best Practices",
      recommended: false,
      requiresTypeChecking: true,
    },
    messages: {
      ClassProperty:
        "Please annotate this property with the correct one. This property is inferred as any type.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const { program, esTreeNodeToTSNodeMap } = ESLintUtils.getParserServices(
      context
    );
    function report(location: TSESTree.Node, message: "ClassProperty"): void {
      context.report({
        node: location,
        messageId: message,
      });
    }
    const checker = program.getTypeChecker();

    return {
      ClassProperty(node): void {
        const esnode = esTreeNodeToTSNodeMap.get(node);
        const properityType = checker.getTypeAtLocation(esnode);
        if (isTypeAnyType(properityType)) {
          report(node, "ClassProperty");
        }
      },
    };
  },
});
