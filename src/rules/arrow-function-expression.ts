import { ESLintUtils, TSESTree, createRule, isTypeAnyType } from "../utils";

export const arrowFunctionExpression = createRule({
  name: "arrow-function-expression",
  meta: {
    type: "suggestion",
    docs: {
      description: "",
      category: "Best Practices",
      recommended: false,
      requiresTypeChecking: true,
    },
    messages: {
      ArrowFunctionExpression:
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
      message: "ArrowFunctionExpression" | "AnyReturnType"
    ): void {
      context.report({
        node: location,
        messageId: message,
      });
    }
    const checker = program.getTypeChecker();

    return {
      /**
       *
       * const foo = (e) => e;
       * //           ^~~ detect this any pattern
       * @param node
       */
      ArrowFunctionExpression(node): void {
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
          report(anyParamNode, "ArrowFunctionExpression");
        }
      },
    };
  },
});
