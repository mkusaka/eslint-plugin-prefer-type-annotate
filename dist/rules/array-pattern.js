"use strict";
exports.__esModule = true;
exports.arrayPattern = void 0;
var utils_1 = require("../utils");
exports.arrayPattern = utils_1.createRule({
    name: "array-pattern",
    meta: {
        type: "suggestion",
        docs: {
            description: "",
            category: "Best Practices",
            recommended: false,
            requiresTypeChecking: true
        },
        messages: {
            ArrayPattern: "Please annotate this array with the correct one. This array is inferred as any type."
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
            ArrayPattern: function (node) {
                var esnode = esTreeNodeToTSNodeMap.get(node);
                var arrType = checker.getTypeAtLocation(esnode);
                if (utils_1.isTypeAnyType(arrType)) {
                    report(node, "ArrayPattern");
                }
            }
        };
    }
});
