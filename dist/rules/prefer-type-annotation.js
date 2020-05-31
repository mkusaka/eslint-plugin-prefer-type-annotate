"use strict";
exports.__esModule = true;
exports.preferTypeAnnotation = void 0;
var experimental_utils_1 = require("@typescript-eslint/experimental-utils");
var createRule = experimental_utils_1.ESLintUtils.RuleCreator(function (ruleName) { return ruleName; });
exports.preferTypeAnnotation = createRule({
    name: "prefer-type-annotate",
    meta: {
        type: "suggestion",
        docs: {
            description: "",
            category: "Best Practices",
            recommended: false,
            requiresTypeChecking: true
        },
        messages: {
            preferTypeAnnotate: ":("
        },
        schema: []
    },
    defaultOptions: [],
    create: function (context) {
        var _a;
        var _b = experimental_utils_1.ESLintUtils.getParserServices(context), program = _b.program, esTreeNodeToTSNodeMap = _b.esTreeNodeToTSNodeMap;
        var checker = program.getTypeChecker();
        // const sourceCode = context.getSourceCode();
        // const printer = (n: TSESTree.Node) => sourceCode.getText(n);
        // const filePath = context.getFilename();
        return _a = {},
            _a[experimental_utils_1.AST_NODE_TYPES.CallExpression] = function (node) {
                console.log(node.callee);
                if (node.callee.type === experimental_utils_1.AST_NODE_TYPES.MemberExpression &&
                    node.callee.property.type === experimental_utils_1.AST_NODE_TYPES.Identifier) {
                    var obj = node.callee.object;
                    var prop = node.callee.property;
                    var objTsNode = esTreeNodeToTSNodeMap.get(obj);
                    var objType = checker.getTypeAtLocation(objTsNode);
                    console.log(checker.typeToString(objType));
                    if (checker.typeToString(objType) === "") {
                        if (["next", "prev", "parseInt"].includes(prop.name)) {
                            context.report({
                                node: node,
                                messageId: "preferTypeAnnotate",
                                data: {
                                    method: prop.name
                                }
                            });
                        }
                    }
                }
            },
            _a;
    }
});
//# sourceMappingURL=prefer-type-annotation.js.map