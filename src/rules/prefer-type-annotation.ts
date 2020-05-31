import {
  ESLintUtils,
  TSESTree,
  // AST_NODE_TYPES
} from "@typescript-eslint/experimental-utils";
import {
  unionTypeParts
} from "tsutils"
import * as ts from 'typescript';

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
    function report(location: TSESTree.Node): void {
      context.report({
        node: location,
        messageId: "preferTypeAnnotate",
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

    // function checkParameters(params: TSESTree.Parameter[]): void {
    //   for (const param of params) {
    //     let annotationNode: TSESTree.Node | undefined;

    //     switch (param.type) {
    //       case AST_NODE_TYPES.AssignmentPattern:
    //         annotationNode = param.left;
    //         break;
    //       case AST_NODE_TYPES.TSParameterProperty:
    //         annotationNode = param.parameter;

    //         // Check TS parameter property with default value like `constructor(private param: string = 'something') {}`
    //         if (
    //           annotationNode &&
    //           annotationNode.type === AST_NODE_TYPES.AssignmentPattern
    //         ) {
    //           annotationNode = annotationNode.left;
    //         }

    //         break;
    //       default:
    //         annotationNode = param;
    //         break;
    //     }

    //     if (annotationNode !== undefined && !annotationNode.typeAnnotation) {
    //       // report(param, getNodeName(param));
    //     }
    //   }
    // }

    // const sourceCode = context.getSourceCode();
    // const printer = (n: TSESTree.Node) => sourceCode.getText(n);
    // const filePath = context.getFilename();

    return {
      ArrowFunctionExpression(node): void {
        console.log("params: ", node.params)
        const tsNode = esTreeNodeToTSNodeMap.get(node)
        const nodeType = checker.getTypeAtLocation(tsNode)
        console.log("objType: ", nodeType)
        console.log("isTypeAnyType: ", isTypeAnyType(nodeType))
        const paramstsNode = node.params.map(e => esTreeNodeToTSNodeMap.get(e));
        const paramsnodeTypes = paramstsNode.map(e => checker.getTypeAtLocation(e))
        console.log("objType: ", paramsnodeTypes)
        console.log("isTypeAnyType: ", paramsnodeTypes.map(e => isTypeAnyType(e)))
        for (const anyParamNode of node.params.filter(e => isTypeAnyType(checker.getTypeAtLocation(esTreeNodeToTSNodeMap.get(e))))) {
          report(anyParamNode)
        }
      },
      ReturnStatement(node): void {
        const tsNode = esTreeNodeToTSNodeMap.get(node)
        const nodeType = checker.getTypeAtLocation(tsNode)
        if (isTypeAnyType(nodeType)) {
          report(node)
        }
      }
      // [AST_NODE_TYPES.ArrayPattern](node: TSESTree.LiteralExpression): void {
      //   console.log("node: ", node)
      //   const objTsNode = esTreeNodeToTSNodeMap.get(obj);
      //   const objType = checker.getTypeAtLocation(objTsNode);

      //   console.log("checker to string", checker.typeToString(objType))
      //   if (
      //     node.callee.type === AST_NODE_TYPES.MemberExpression &&
      //     node.callee.property.type === AST_NODE_TYPES.Identifier
      //   ) {
      //     const obj = node.callee.object;
      //     const prop = node.callee.property;
      //     const objTsNode = esTreeNodeToTSNodeMap.get(obj);
      //     const objType = checker.getTypeAtLocation(objTsNode);

      //     console.log(checker.typeToString(objType))
      //     if (checker.typeToString(objType) === "") {
      //       if (["next", "prev", "parseInt"].includes(prop.name)) {
      //         context.report({
      //           node,
      //           messageId: "preferTypeAnnotate",
      //           data: {
      //             method: prop.name,
      //           },
      //         });
      //       }
      //     }
      //   }
      // },
    };
  },
})
