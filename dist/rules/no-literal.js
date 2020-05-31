"use strict";
exports.__esModule = true;
exports.noLiteralRule = void 0;
exports.noLiteralRule = {
    create: function (context) {
        return {
            Literal: function (node) {
                context.report({
                    message: "hi",
                    node: node
                });
            }
        };
    }
};
//# sourceMappingURL=no-literal.js.map