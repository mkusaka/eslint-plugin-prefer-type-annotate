import { TSESTree, createRule } from "../utils";

export const tsAsExpression = createRule({
  name: "ts-as-expression",
  meta: {
    type: "suggestion",
    docs: {
      description: "",
      category: "Best Practices",
      recommended: false,
      requiresTypeChecking: true,
    },
    messages: {
      AsWithAnyKeyword:
        "Please annotate this as assert with the correct one. This as assert is inferred as any type.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    function report(
      location: TSESTree.Node,
      message: "AsWithAnyKeyword"
    ): void {
      context.report({
        node: location,
        messageId: message,
      });
    }

    return {
      TSAsExpression(node): void {
        if (node.typeAnnotation.type === "TSAnyKeyword") {
          report(node, "AsWithAnyKeyword");
        }
      },
    };
  },
});
