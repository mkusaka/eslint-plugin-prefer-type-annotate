"use strict";
exports.__esModule = true;
exports.classProperty = void 0;
var utils_1 = require("../utils");
exports.classProperty = utils_1.createRule({
    name: "class-property",
    meta: {
        type: "suggestion",
        docs: {
            description: "",
            category: "Best Practices",
            recommended: false,
            requiresTypeChecking: true
        },
        messages: {
            ClassProperty: "Please annotate this property with the correct one. This property is inferred as any type."
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
            ClassProperty: function (node) {
                var esnode = esTreeNodeToTSNodeMap.get(node);
                var properityType = checker.getTypeAtLocation(esnode);
                if (utils_1.isTypeAnyType(properityType)) {
                    report(node, "ClassProperty");
                }
            }
        };
    }
});
