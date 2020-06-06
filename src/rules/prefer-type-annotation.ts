import {
  ESLintUtils,
  TSESTree,
  // AST_NODE_TYPES
} from "@typescript-eslint/experimental-utils";
import {
  unionTypeParts
} from "tsutils"
import ts from 'typescript';

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
      ArrowFunctionExpression: "ArrowFunctionExpression",
      FunctionExpression: "FunctionExpression",
      FunctionDeclaration: "FunctionDeclaration",
      ArrayPattern: "ArrayPattern",
      ClassProperty: "ClassProperty",
      TSIndexSignature: "TSIndexSignature",
      ObjectPattern: "ObjectPattern",
      TSPropertySignature: "TSPropertySignature",
      VariableDeclarator: "VariableDeclarator",
      VariableDeclaratorObject: "VariableDeclaratorObject",
      VariableDeclaratorArray: "VariableDeclaratorArray"
    },
    schema: []
  },
  defaultOptions: [],
  create(context) {
    const { program, esTreeNodeToTSNodeMap } = ESLintUtils.getParserServices(
      context
    );
    function report(
      location: TSESTree.Node,
      message:
        | "ArrowFunctionExpression"
        | "FunctionExpression"
        | "FunctionDeclaration"
        | "ArrayPattern"
        | "ClassProperty"
        | "TSIndexSignature"
        | "ObjectPattern"
        | "TSPropertySignature"
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

    function getTypeFlags(type: ts.Type) {
      let flags: ts.TypeFlags = 0;
      for (const t of unionTypeParts(type)) {
        flags |= t.flags;
      }
      return flags;
    }

    function isTypeFlagSet(type: ts.Type, flagsToCheck: ts.TypeFlags) {
      const flags = getTypeFlags(type);

      return (flags & flagsToCheck) !== 0;
    }

    function isTypeAnyType(type: ts.Type) {
      return isTypeFlagSet(type, ts.TypeFlags.Any)
    }

    return {
      ArrowFunctionExpression(node): void {
        // TODO: detect return type any,,,,,
        for (const anyParamNode of node.params.filter(e => isTypeAnyType(checker.getTypeAtLocation(esTreeNodeToTSNodeMap.get(e))))) {
          report(anyParamNode, "ArrowFunctionExpression")
        }
      },
      FunctionExpression(node): void {
        // TODO: detect return type any,,,,,
        for (const anyParamNode of node.params.filter(e => isTypeAnyType(checker.getTypeAtLocation(esTreeNodeToTSNodeMap.get(e))))) {
          report(anyParamNode, "FunctionExpression")
        }
      },
      FunctionDeclaration(node): void {
        // TODO: detect return type any,,,,,
        for (const anyParamNode of node.params.filter(e => isTypeAnyType(checker.getTypeAtLocation(esTreeNodeToTSNodeMap.get(e))))) {
          report(anyParamNode, "FunctionDeclaration")
        }
      },
      ArrayPattern(node): void {
        const esnode = esTreeNodeToTSNodeMap.get(node);
        const arrType = checker.getTypeAtLocation(esnode)
        if (isTypeAnyType(arrType)) {
          report(node, "ArrayPattern")
        }
      },
      ClassProperty(node): void {
        const esnode = esTreeNodeToTSNodeMap.get(node);
        const properityType = checker.getTypeAtLocation(esnode);
        if (isTypeAnyType(properityType)) {
          report(node, "ClassProperty")
        }
      },
      TSIndexSignature(node): void {
        // because of `An index signature must have a type annotation.ts(1021)` error from tsc, we don't need check type by checker
        if (node.typeAnnotation?.typeAnnotation.type === "TSAnyKeyword") {
            report(node, "TSIndexSignature");
        }
      },
      ObjectPattern(node): void {
        const esnode = esTreeNodeToTSNodeMap.get(node);
        const declareType = checker.getTypeAtLocation(esnode);
        if (isTypeAnyType(declareType)) {
          report(node, "ObjectPattern")
        }
      },
      TSPropertySignature(node): void {
        const esnode = esTreeNodeToTSNodeMap.get(node);
        const declareType = checker.getTypeAtLocation(esnode);
        if (isTypeAnyType(declareType)) {
          report(node, "TSPropertySignature")
        }
      },
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
      }
    };
  },
})
