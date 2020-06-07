import { ESLintUtils, TSESTree, createRule, isTypeAnyType } from "../utils";

export const functionExpression = createRule({
  name: "function-expression",
  meta: {
    type: "suggestion",
    docs: {
      description: "",
      category: "Best Practices",
      recommended: false,
      requiresTypeChecking: true,
    },
    messages: {
      FunctionExpression:
        "Please annotate this parameter with the correct one. This parameter is inferred as any type.",
      AnyReturnType:
        "Please annotate this function return type with the correct one. This function return type is inferred as any type.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const { program, esTreeNodeToTSNodeMap } = ESLintUtils.getParserServices(
      context
    );
    function report(
      location: TSESTree.Node,
      message: "FunctionExpression" | "AnyReturnType"
    ): void {
      context.report({
        node: location,
        messageId: message,
      });
    }
    const checker = program.getTypeChecker();

    return {
      FunctionExpression(node): void {
        const signatures = checker
          .getTypeAtLocation(esTreeNodeToTSNodeMap.get(node))
          .getCallSignatures();
        if (signatures.length) {
          const returnType = checker.getReturnTypeOfSignature(signatures[0]);
          if (isTypeAnyType(returnType)) {
            report(node, "AnyReturnType");
          }
        }
        for (const anyParamNode of node.params.filter((e) =>
          isTypeAnyType(checker.getTypeAtLocation(esTreeNodeToTSNodeMap.get(e)))
        )) {
          report(anyParamNode, "FunctionExpression");
        }
      },
    };
  },
});
