import { ReportFixFunction } from "@typescript-eslint/experimental-utils/dist/ts-eslint";
import { ESLintUtils, TSESTree, createRule, isTypeAnyType } from "../utils";

type SchemaType = {
  replaceType: string;
};

export const arrowFunctionExpression = createRule<
  [SchemaType],
  "ArrowFunctionExpression" | "AnyReturnType"
>({
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
    schema: [
      {
        type: "object",
        properties: {
          replaceType: {
            type: "string",
          },
        },
        additionalProperties: false,
      },
    ],
    fixable: "code",
  },
  defaultOptions: [
    {
      replaceType: "any",
    },
  ],
  create(context, [options]) {
    const { program, esTreeNodeToTSNodeMap } = ESLintUtils.getParserServices(
      context
    );
    function report(
      location: TSESTree.Node,
      message: "ArrowFunctionExpression" | "AnyReturnType",
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
            report(node, "AnyReturnType", (fixer) => {
              if (!node.returnType) {
                const lastParamRange =
                  node.params[node.params.length - 1].range;
                const { replaceType } = options;
                return fixer.insertTextAfterRange(
                  [lastParamRange[0], lastParamRange[1] + 1],
                  `: ${replaceType}`
                );
              }
              return null;
            });
          }
        }
        for (const anyParamNode of node.params.filter((e) =>
          isTypeAnyType(checker.getTypeAtLocation(esTreeNodeToTSNodeMap.get(e)))
        )) {
          const { replaceType } = options;
          report(anyParamNode, "ArrowFunctionExpression", (fixer) => {
            if ("name" in anyParamNode && !anyParamNode.typeAnnotation) {
              return fixer.replaceText(
                anyParamNode,
                `${anyParamNode.name}: ${replaceType}`
              );
            }
            return null;
          });
        }
      },
    };
  },
});
