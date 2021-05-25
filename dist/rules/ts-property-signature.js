"use strict";
exports.__esModule = true;
exports.tsPropertySignature = void 0;
var utils_1 = require("../utils");
exports.tsPropertySignature = utils_1.createRule({
    name: "ts-property-signature",
    meta: {
        type: "suggestion",
        docs: {
            description: "",
            category: "Best Practices",
            recommended: false,
            requiresTypeChecking: true
        },
        messages: {
            TSPropertySignature: "Please annotate this property signature with the correct one. This property signature is inferred as any type."
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
             * interface {
             *   key: any;
             *   //   ^~~ detect this any pattern
             *   value;
             *   //   ^~~ also detect this any pattern
             * }
             * @param node
             */
            TSPropertySignature: function (node) {
                var esnode = esTreeNodeToTSNodeMap.get(node);
                var declareType = checker.getTypeAtLocation(esnode);
                if (utils_1.isTypeAnyType(declareType)) {
                    report(node, "TSPropertySignature");
                }
            }
        };
    }
});
