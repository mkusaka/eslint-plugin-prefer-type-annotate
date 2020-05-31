import {
  ESLintUtils,
  TSESTree,
  AST_NODE_TYPES
} from "@typescript-eslint/experimental-utils";

const createRule = ESLintUtils.RuleCreator((ruleName) => ruleName);

export const preferTypeAnnotation = createRule({
  name: "prefer-type-annotate",
  meta: {
    type: "suggestion",
    docs: {
      description: "",
      category: "Best Practices",
      recommended: false,
      requiresTypeChecking: true
    },
    messages: {
      preferTypeAnnotate: ":("
    },
    schema: []
  },
  defaultOptions: [],
  create(context) {
    const { program, esTreeNodeToTSNodeMap } = ESLintUtils.getParserServices(
      context
    );
    const checker = program.getTypeChecker();

    // const sourceCode = context.getSourceCode();
    // const printer = (n: TSESTree.Node) => sourceCode.getText(n);
    // const filePath = context.getFilename();

    return {
      [AST_NODE_TYPES.CallExpression](node: TSESTree.CallExpression): void {
        console.log(node.callee)
        if (
          node.callee.type === AST_NODE_TYPES.MemberExpression &&
          node.callee.property.type === AST_NODE_TYPES.Identifier
        ) {
          const obj = node.callee.object;
          const prop = node.callee.property;
          const objTsNode = esTreeNodeToTSNodeMap.get(obj);
          const objType = checker.getTypeAtLocation(objTsNode);

          console.log(checker.typeToString(objType))
          if (checker.typeToString(objType) === "") {
            if (["next", "prev", "parseInt"].includes(prop.name)) {
              context.report({
                node,
                messageId: "preferTypeAnnotate",
                data: {
                  method: prop.name,
                },
              });
            }
          }
        }
      },
    };
  },
})
