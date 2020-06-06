import {
  ESLintUtils,
  TSESTree,
  // AST_NODE_TYPES
} from "@typescript-eslint/experimental-utils";
import ts from "typescript";

const createRule = ESLintUtils.RuleCreator((ruleName) => ruleName);

export const preferTypeAnnotation = createRule({
  name: "prefer-type-annotate",
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
      FunctionExpression:
        "Please annotate this parameter with the correct one. This parameter is inferred as any type.",
      FunctionDeclaration:
        "Please annotate this parameter with the correct one. This parameter is inferred as any type.",
      ArrayPattern:
        "Please annotate this array with the correct one. This array is inferred as any type.",
      ClassProperty:
        "Please annotate this property with the correct one. This property is inferred as any type.",
      TSIndexSignature:
        "Please annotate this signature with the correct one. This signature is inferred as any type.",
      ObjectPattern:
        "Please annotate this object with the correct one. This object is inferred as any type.",
      TSPropertySignature:
        "Please annotate this property signature with the correct one. This property signature is inferred as any type.",
      VariableDeclarator:
        "Please annotate this variable with the correct one. This variable is inferred as any type.",
      VariableDeclaratorObject:
        "Please annotate this variable with the correct one. This variable is inferred as any type.",
      VariableDeclaratorArray:
        "Please annotate this variable with the correct one. This variable is inferred as any type.",
      AsWithAnyKeyword:
        "Please annotate this as assert with the correct one. This as assert is inferred as any type.",
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
        | "AsWithAnyKeyword"
    ): void {
      context.report({
        node: location,
        messageId: message,
      });
    }
    const checker = program.getTypeChecker();

    function isTypeAnyType({ flags }: ts.Type) {
      return flags === ts.TypeFlags.Any;
    }

    return {
      /**
       *
       * const foo = (e) => e;
       * //           ^~~ detect this any pattern
       * @param node
       */
      ArrowFunctionExpression(node): void {
        // TODO: detect return type any,,,,,
        for (const anyParamNode of node.params.filter((e) =>
          isTypeAnyType(checker.getTypeAtLocation(esTreeNodeToTSNodeMap.get(e)))
        )) {
          report(anyParamNode, "ArrowFunctionExpression");
        }
      },
      /**
       *
       * class Foo {
       *   constructor(a) {}
       *   //          ^~~ detect this any pattern
       * }
       * @param node
       */
      FunctionExpression(node): void {
        // TODO: detect return type any,,,,,
        for (const anyParamNode of node.params.filter((e) =>
          isTypeAnyType(checker.getTypeAtLocation(esTreeNodeToTSNodeMap.get(e)))
        )) {
          report(anyParamNode, "FunctionExpression");
        }
      },
      /**
       *
       * function foo(e) {return e};
       * //           ^~~ detect this any pattern
       * @param node
       */
      FunctionDeclaration(node): void {
        // TODO: detect return type any,,,,,
        for (const anyParamNode of node.params.filter((e) =>
          isTypeAnyType(checker.getTypeAtLocation(esTreeNodeToTSNodeMap.get(e)))
        )) {
          report(anyParamNode, "FunctionDeclaration");
        }
      },
      ArrayPattern(node): void {
        const esnode = esTreeNodeToTSNodeMap.get(node);
        const arrType = checker.getTypeAtLocation(esnode);
        if (isTypeAnyType(arrType)) {
          report(node, "ArrayPattern");
        }
      },
      ClassProperty(node): void {
        const esnode = esTreeNodeToTSNodeMap.get(node);
        const properityType = checker.getTypeAtLocation(esnode);
        if (isTypeAnyType(properityType)) {
          report(node, "ClassProperty");
        }
      },
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
      ObjectPattern(node): void {
        const esnode = esTreeNodeToTSNodeMap.get(node);
        const declareType = checker.getTypeAtLocation(esnode);
        if (isTypeAnyType(declareType)) {
          report(node, "ObjectPattern");
        }
      },
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
      TSAsExpression(node): void {
        if (node.typeAnnotation.type === "TSAnyKeyword") {
          report(node, "AsWithAnyKeyword");
        }
      },
    };
  },
});
