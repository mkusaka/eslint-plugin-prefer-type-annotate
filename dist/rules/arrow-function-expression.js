"use strict";
exports.__esModule = true;
exports.arrowFunctionExpression = void 0;
var utils_1 = require("../utils");
exports.arrowFunctionExpression = utils_1.createRule({
    name: "arrow-function-expression",
    meta: {
        type: "suggestion",
        docs: {
            description: "",
            category: "Best Practices",
            recommended: false,
            requiresTypeChecking: true
        },
        messages: {
            ArrowFunctionExpression: "Please annotate this parameter with the correct one. This parameter is inferred as any type.",
            AnyReturnType: "Please annotate this function return type with the correct one. This function return type is inferred as any type."
        },
        schema: []
    },
    defaultOptions: [],
    create: function (context) {
        var _a = utils_1.ESLintUtils.getParserServices(context), program = _a.program, esTreeNodeToTSNodeMap = _a.esTreeNodeToTSNodeMap;
        function report(location, message) {
            context.report({
                node: location,
                messageId: message
            });
        }
        var checker = program.getTypeChecker();
        return {
            /**
             *
             * const foo = (e) => e;
             * //           ^~~ detect this any pattern
             * @param node
             */
            ArrowFunctionExpression: function (node) {
                var signatures = checker
                    .getTypeAtLocation(esTreeNodeToTSNodeMap.get(node))
                    .getCallSignatures();
                if (signatures.length) {
                    var returnType = checker.getReturnTypeOfSignature(signatures[0]);
                    if (utils_1.isTypeAnyType(returnType)) {
                        report(node, "AnyReturnType");
                    }
                }
                for (var _i = 0, _a = node.params.filter(function (e) {
                    return utils_1.isTypeAnyType(checker.getTypeAtLocation(esTreeNodeToTSNodeMap.get(e)));
                }); _i < _a.length; _i++) {
                    var anyParamNode = _a[_i];
                    report(anyParamNode, "ArrowFunctionExpression");
                }
            }
        };
    }
});
