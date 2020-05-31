"use strict";
exports.__esModule = true;
exports.preferTypeAnnotation = void 0;
var tslib_1 = require("tslib");
var experimental_utils_1 = require("@typescript-eslint/experimental-utils");
var tsutils_1 = require("tsutils");
var ts = tslib_1.__importStar(require("typescript"));
var createRule = experimental_utils_1.ESLintUtils.RuleCreator(function (ruleName) { return ruleName; });
exports.preferTypeAnnotation = createRule({
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
    create: function (context) {
        var _a = experimental_utils_1.ESLintUtils.getParserServices(context), program = _a.program, esTreeNodeToTSNodeMap = _a.esTreeNodeToTSNodeMap;
        function report(location) {
            context.report({
                node: location,
                messageId: "preferTypeAnnotate"
            });
        }
        var checker = program.getTypeChecker();
        function getTypeFlags(type) {
            var flags = 0;
            for (var _i = 0, _a = tsutils_1.unionTypeParts(type); _i < _a.length; _i++) {
                var t = _a[_i];
                flags |= t.flags;
            }
            return flags;
        }
        function isTypeFlagSet(type, flagsToCheck) {
            var flags = getTypeFlags(type);
            return (flags & flagsToCheck) !== 0;
        }
        function isTypeAnyType(type) {
            return isTypeFlagSet(type, ts.TypeFlags.Any);
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
            ArrowFunctionExpression: function (node) {
                console.log("params: ", node.params);
                var tsNode = esTreeNodeToTSNodeMap.get(node);
                var nodeType = checker.getTypeAtLocation(tsNode);
                console.log("objType: ", nodeType);
                console.log("isTypeAnyType: ", isTypeAnyType(nodeType));
                var paramstsNode = node.params.map(function (e) { return esTreeNodeToTSNodeMap.get(e); });
                var paramsnodeTypes = paramstsNode.map(function (e) { return checker.getTypeAtLocation(e); });
                console.log("objType: ", paramsnodeTypes);
                console.log("isTypeAnyType: ", paramsnodeTypes.map(function (e) { return isTypeAnyType(e); }));
                for (var _i = 0, _a = node.params.filter(function (e) { return isTypeAnyType(checker.getTypeAtLocation(esTreeNodeToTSNodeMap.get(e))); }); _i < _a.length; _i++) {
                    var anyParamNode = _a[_i];
                    report(anyParamNode);
                }
            }
        };
    }
});
//# sourceMappingURL=prefer-type-annotation.js.map