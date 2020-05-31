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
        function report(location, name) {
            context.report({
                node: location,
                messageId: "preferTypeAnnotate",
                data: { name: name }
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
                report(node);
            }
        };
    }
});
//# sourceMappingURL=prefer-type-annotation.js.map