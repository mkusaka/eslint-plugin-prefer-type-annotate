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
    const allDiagnostics = ts.getPreEmitDiagnostics(
      program,
      program.getSourceFile(context.getFilename())
    );
    program.getSyntacticDiagnostics().forEach((diagnostic) => {
      if (!diagnostic) {
        return;
      }

      if (!diagnostic.file || !diagnostic.start) {
        return;
      }

      const position = diagnostic.file.getLineAndCharacterOfPosition(
        diagnostic.start
      );
      // エラーを検出した位置
      const line = position.line + 1;
      const character = position.character + 1;
      console.log(diagnostic.file.fileName);
      console.log(`ErrorPosition: ${line}, ${character}`); // 検出したエラー内容
      const message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        "\n"
      );
      console.log(`ErrorMessage: ${message}`);
    });
    allDiagnostics.forEach((diagnostic: ts.Diagnostic) => {
      if (!diagnostic) {
        return;
      }

      if (!diagnostic.file || !diagnostic.start) {
        return;
      }

      const position = diagnostic.file.getLineAndCharacterOfPosition(
        diagnostic.start
      );
      // エラーを検出した位置
      const line = position.line + 1;
      const character = position.character + 1;
      console.log(diagnostic.file.fileName);
      console.log(`ErrorPosition: ${line}, ${character}`); // 検出したエラー内容
      const message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        "\n"
      );
      console.log(`ErrorMessage: ${message}`);
    });

    context.getSourceCode();
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
        | "AnyReturnType"
    ): void {
      context.report({
        node: location,
        messageId: message,
      });
    }
    const starts = allDiagnostics.filter((e) => {
      return e && e.file && e.start;
    });
    const startExpressions = starts.reduce<{ [key: string]: string }>(
      (prev, next) => {
        const message = ts.flattenDiagnosticMessageText(next.messageText, "\n");
        return {
          ...prev,
          [`${next.start},${next.start + next.length}`]: message,
        };
      },
      {}
    );
    const checker = program.getTypeChecker();

    function isTypeAnyType({ flags }: ts.Type) {
      return flags === ts.TypeFlags.Any;
    }

    return {
      "*": function (node) {
        // @ts-ignore
        console.dir(node.range);
        // @ts-ignore
        if (startExpressions[`${node.range[0]},${node.range[1]}`]) {
          // @ts-ignore
          report(node, startExpressions[`${node.range[0]},${node.range[1]}`] as any);
        }
        // report()
      },
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
      /**
       *
       * class Foo {
       *   constructor(a) {}
       *   //          ^~~ detect this any pattern
       * }
       * @param node
       */
      FunctionExpression(node): void {
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
