import { ReportFixFunction } from "@typescript-eslint/experimental-utils/dist/ts-eslint";
import { ESLintUtils, TSESTree, createRule, isTypeAnyType } from "../utils";

export const functionDeclaration = createRule({
  name: "function-declaration",
  meta: {
    type: "suggestion",
    docs: {
      description: "",
      category: "Best Practices",
      recommended: false,
      requiresTypeChecking: true,
    },
    messages: {
      FunctionDeclaration:
        "Please annotate this parameter with the correct one. This parameter is inferred as any type.",
      AnyReturnType:
        "Please annotate this function return type with the correct one. This function return type is inferred as any type.",
    },
    schema: [],
    fixable: "code",
  },
  defaultOptions: [],
  create(context) {
    const { program, esTreeNodeToTSNodeMap } = ESLintUtils.getParserServices(
      context
    );
    function report(
      location: TSESTree.Node,
      message: "FunctionDeclaration" | "AnyReturnType",
      fix?: ReportFixFunction
    ): void {
      context.report({
        node: location,
        messageId: message,
        fix,
      });
    }
    const checker = program.getTypeChecker();

    return {
      /**
       *
       * function foo(e) {return e};
       * //           ^~~ detect this any pattern
       * @param node
       */
      FunctionDeclaration(node): void {
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
          report(anyParamNode, "FunctionDeclaration", (fixer) => {
            return fixer.insertTextAfter(anyParamNode, "some: any");
          });
        }
      },
    };
  },
});
