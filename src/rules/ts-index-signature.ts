import { TSESTree, createRule } from "../utils";

export const tsIndexSignature = createRule({
  name: "ts-index-signature",
  meta: {
    type: "suggestion",
    docs: {
      description: "",
      category: "Best Practices",
      recommended: false,
    },
    messages: {
      TSIndexSignature:
        "Please annotate this signature with the correct one. This signature is inferred as any type.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    function report(
      location: TSESTree.Node,
      message: "TSIndexSignature"
    ): void {
      context.report({
        node: location,
        messageId: message,
      });
    }

    return {
      /**
       *
       * interface {
       *   [key: string]: any;
       *   //             ^~~ detect this any pattern
       * }
       * @param node
       */
      TSIndexSignature(node): void {
        // because of `An index signature must have a type annotation.ts(1021)` error from tsc, we don't need check type by checker
        if (node.typeAnnotation?.typeAnnotation.type === "TSAnyKeyword") {
          report(node, "TSIndexSignature");
        }
      },
    };
  },
});
