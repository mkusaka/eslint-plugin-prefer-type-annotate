"use strict";
exports.__esModule = true;
exports.objectPattern = void 0;
var utils_1 = require("../utils");
exports.objectPattern = utils_1.createRule({
    name: "object-pattern",
    meta: {
        type: "suggestion",
        docs: {
            description: "",
            category: "Best Practices",
            recommended: false,
            requiresTypeChecking: true
        },
        messages: {
            ObjectPattern: "Please annotate this object with the correct one. This object is inferred as any type."
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
            ObjectPattern: function (node) {
                var esnode = esTreeNodeToTSNodeMap.get(node);
                var declareType = checker.getTypeAtLocation(esnode);
                if (utils_1.isTypeAnyType(declareType)) {
                    report(node, "ObjectPattern");
                }
            }
        };
    }
});
