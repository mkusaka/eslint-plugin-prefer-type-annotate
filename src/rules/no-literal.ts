import { Rule } from "eslint";

export const noLiteralRule: Rule.RuleModule = {
  create: (context) => {
    return {
      Literal: (node) => {
        context.report({
          message: "hi",
          node,
        });
      },
    };
  },
};
