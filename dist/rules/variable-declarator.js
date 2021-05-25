"use strict";
exports.__esModule = true;
exports.variableDeclarator = void 0;
var utils_1 = require("../utils");
exports.variableDeclarator = utils_1.createRule({
    name: "variable-declarator",
    meta: {
        type: "suggestion",
        docs: {
            description: "",
            category: "Best Practices",
            recommended: false,
            requiresTypeChecking: true
        },
        messages: {
            VariableDeclarator: "Please annotate this variable with the correct one. This variable is inferred as any type.",
            VariableDeclaratorObject: "Please annotate this variable with the correct one. This variable is inferred as any type.",
            VariableDeclaratorArray: "Please annotate this variable with the correct one. This variable is inferred as any type."
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
            VariableDeclarator: function (node) {
                switch (node.id.type) {
                    // const { foo, bar, baz } = obj;
                    case "ObjectPattern":
                        node.id.properties.forEach(function (e) {
                            try {
                                // FIXME: sometime, getTypeAtLocation returns error. so temporally just warn and ignore it.
                                var declareType = checker.getTypeAtLocation(esTreeNodeToTSNodeMap.get(e));
                                if (utils_1.isTypeAnyType(declareType)) {
                                    report(e, "VariableDeclaratorObject");
                                }
                            }
                            catch (e) {
                                console.warn(e);
                            }
                        });
                        break;
                    // const [ foo, bar, baz ] = arr;
                    case "ArrayPattern":
                        node.id.elements.filter(Boolean).forEach(function (e) {
                            var declareType = checker.getTypeAtLocation(esTreeNodeToTSNodeMap.get(e));
                            if (utils_1.isTypeAnyType(declareType)) {
                                report(e, "VariableDeclaratorArray");
                            }
                        });
                        break;
                    default: {
                        var esnode = esTreeNodeToTSNodeMap.get(node);
                        var declareType = checker.getTypeAtLocation(esnode);
                        if (utils_1.isTypeAnyType(declareType)) {
                            report(node, "VariableDeclarator");
                        }
                        break;
                    }
                }
            }
        };
    }
});
