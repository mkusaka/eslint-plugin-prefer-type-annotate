import { ESLintUtils, TSESTree, createRule, isTypeAnyType } from "../utils";

export const tsPropertySignature = createRule({
  name: "ts-property-signature",
  meta: {
    type: "suggestion",
    docs: {
      description: "",
      category: "Best Practices",
      recommended: false,
      requiresTypeChecking: true,
    },
    messages: {
      TSPropertySignature:
        "Please annotate this property signature with the correct one. This property signature is inferred as any type.",
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
      message: "TSPropertySignature"
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
       * interface {
       *   key: any;
       *   //   ^~~ detect this any pattern
       *   value;
       *   //   ^~~ also detect this any pattern
       * }
       * @param node
       */
      TSPropertySignature(node): void {
        const esnode = esTreeNodeToTSNodeMap.get(node);
        const declareType = checker.getTypeAtLocation(esnode);
        if (isTypeAnyType(declareType)) {
          report(node, "TSPropertySignature");
        }
      },
    };
  },
});
