import { RuleTester } from "eslint";

import { noLiteralRule } from "../../src/rules/no-literal";

const tester = new RuleTester({ parserOptions: { ecmaVersion: 2015 } });

tester.run("no-literal", noLiteralRule, {
  valid: [{ code: `let x` }],
  invalid: [
    {
      code: `const x = 1;`,
      errors: [{ message: "hi" }],
    },
  ],
});
