"use strict";
exports.__esModule = true;
exports.tsAsExpression = void 0;
var utils_1 = require("../utils");
exports.tsAsExpression = utils_1.createRule({
    name: "ts-as-expression",
    meta: {
        type: "suggestion",
        docs: {
            description: "",
            category: "Best Practices",
            recommended: false,
            requiresTypeChecking: true
        },
        messages: {
            AsWithAnyKeyword: "Please annotate this as assert with the correct one. This as assert is inferred as any type."
        },
        schema: []
    },
    defaultOptions: [],
    create: function (context) {
        function report(location, message) {
            context.report({
                node: location,
                messageId: message
            });
        }
        return {
            TSAsExpression: function (node) {
                if (node.typeAnnotation.type === "TSAnyKeyword") {
                    report(node, "AsWithAnyKeyword");
                }
            }
        };
    }
});
