"use strict";
exports.__esModule = true;
exports.tsIndexSignature = void 0;
var utils_1 = require("../utils");
exports.tsIndexSignature = utils_1.createRule({
    name: "ts-index-signature",
    meta: {
        type: "suggestion",
        docs: {
            description: "",
            category: "Best Practices",
            recommended: false
        },
        messages: {
            TSIndexSignature: "Please annotate this signature with the correct one. This signature is inferred as any type."
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
            /**
             *
             * interface {
             *   [key: string]: any;
             *   //             ^~~ detect this any pattern
             * }
             * @param node
             */
            TSIndexSignature: function (node) {
                var _a;
                // because of `An index signature must have a type annotation.ts(1021)` error from tsc, we don't need check type by checker
                if (((_a = node.typeAnnotation) === null || _a === void 0 ? void 0 : _a.typeAnnotation.type) === "TSAnyKeyword") {
                    report(node, "TSIndexSignature");
                }
            }
        };
    }
});
