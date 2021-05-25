"use strict";
exports.__esModule = true;
exports.functionDeclaration = void 0;
var utils_1 = require("../utils");
exports.functionDeclaration = utils_1.createRule({
    name: "function-declaration",
    meta: {
        type: "suggestion",
        docs: {
            description: "",
            category: "Best Practices",
            recommended: false,
            requiresTypeChecking: true
        },
        messages: {
            FunctionDeclaration: "Please annotate this parameter with the correct one. This parameter is inferred as any type.",
            AnyReturnType: "Please annotate this function return type with the correct one. This function return type is inferred as any type."
        },
        schema: [],
        fixable: "code"
    },
    defaultOptions: [],
    create: function (context) {
        var _a = utils_1.ESLintUtils.getParserServices(context), program = _a.program, esTreeNodeToTSNodeMap = _a.esTreeNodeToTSNodeMap;
        function report(location, message, fix) {
            context.report({
                node: location,
                messageId: message,
                fix: fix
            });
        }
        var checker = program.getTypeChecker();
        return {
            /**
             *
             * function foo(e) {return e};
             * //           ^~~ detect this any pattern
             * @param node
             */
            FunctionDeclaration: function (node) {
                var signatures = checker
                    .getTypeAtLocation(esTreeNodeToTSNodeMap.get(node))
                    .getCallSignatures();
                if (signatures.length) {
                    var returnType = checker.getReturnTypeOfSignature(signatures[0]);
                    if (utils_1.isTypeAnyType(returnType)) {
                        report(node, "AnyReturnType");
                    }
                }
                var _loop_1 = function (anyParamNode) {
                    report(anyParamNode, "FunctionDeclaration", function (fixer) {
                        return fixer.insertTextAfter(anyParamNode, "some: any");
                    });
                };
                for (var _i = 0, _a = node.params.filter(function (e) {
                    return utils_1.isTypeAnyType(checker.getTypeAtLocation(esTreeNodeToTSNodeMap.get(e)));
                }); _i < _a.length; _i++) {
                    var anyParamNode = _a[_i];
                    _loop_1(anyParamNode);
                }
            }
        };
    }
});
