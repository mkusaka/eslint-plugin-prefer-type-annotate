import { ReportFixFunction } from "@typescript-eslint/experimental-utils/dist/ts-eslint";
import { ESLintUtils, TSESTree, createRule, isTypeAnyType } from "../utils";

type SchemaType = {
  replaceType: string;
};

export const tsPropertySignature = createRule<
  [SchemaType],
  "TSPropertySignature"
>({
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
      message: "TSPropertySignature",
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
          const { replaceType } = options;
          // report(declareType, "FunctionDeclaration", (fixer) => {
          report(node, "TSPropertySignature", (fixer) => {
            const key = node.key;
            if ("name" in key && !node.typeAnnotation) {
              return fixer.replaceText(
                node,
                // FIXME: may name to be not string
                `${key.name as string}: ${replaceType}`
              );
            }
            return null;
          });
        }
      },
    };
  },
});
