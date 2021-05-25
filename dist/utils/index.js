"use strict";
exports.__esModule = true;
exports.isTypeAnyType = exports.TSESTree = exports.ESLintUtils = exports.createRule = void 0;
var tslib_1 = require("tslib");
var experimental_utils_1 = require("@typescript-eslint/experimental-utils");
exports.ESLintUtils = experimental_utils_1.ESLintUtils;
exports.TSESTree = experimental_utils_1.TSESTree;
var typescript_1 = tslib_1.__importDefault(require("typescript"));
function isTypeAnyType(_a) {
    var flags = _a.flags;
    return flags === typescript_1["default"].TypeFlags.Any;
}
exports.isTypeAnyType = isTypeAnyType;
var createRule = experimental_utils_1.ESLintUtils.RuleCreator(function (ruleName) { return ruleName; });
exports.createRule = createRule;
