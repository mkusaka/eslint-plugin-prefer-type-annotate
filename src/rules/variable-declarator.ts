import { ESLintUtils, TSESTree, createRule, isTypeAnyType } from "../utils";

export const variableDeclarator = createRule({
  name: "variable-declarator",
  meta: {
    type: "suggestion",
    docs: {
      description: "",
      category: "Best Practices",
      recommended: false,
      requiresTypeChecking: true,
    },
    messages: {
      VariableDeclarator:
        "Please annotate this variable with the correct one. This variable is inferred as any type.",
      VariableDeclaratorObject:
        "Please annotate this variable with the correct one. This variable is inferred as any type.",
      VariableDeclaratorArray:
        "Please annotate this variable with the correct one. This variable is inferred as any type.",
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
      message:
        | "VariableDeclarator"
        | "VariableDeclaratorArray"
        | "VariableDeclaratorObject"
    ): void {
      context.report({
        node: location,
        messageId: message,
      });
    }
    const checker = program.getTypeChecker();

    return {
      VariableDeclarator(node): void {
        switch (node.id.type) {
          // const { foo, bar, baz } = obj;
          case "ObjectPattern":
            node.id.properties.forEach((e) => {
              const declareType = checker.getTypeAtLocation(
                esTreeNodeToTSNodeMap.get(e)
              );
              if (isTypeAnyType(declareType)) {
                report(e, "VariableDeclaratorObject");
              }
            });
            break;
          // const [ foo, bar, baz ] = arr;
          case "ArrayPattern":
            node.id.elements.filter(Boolean).forEach((e) => {
              const declareType = checker.getTypeAtLocation(
                esTreeNodeToTSNodeMap.get(e!)
              );
              if (isTypeAnyType(declareType)) {
                report(e!, "VariableDeclaratorArray");
              }
            });
            break;
          default: {
            const esnode = esTreeNodeToTSNodeMap.get(node);
            const declareType = checker.getTypeAtLocation(esnode);
            if (isTypeAnyType(declareType)) {
              report(node, "VariableDeclarator");
            }
            break;
          }
        }
      },
    };
  },
});
