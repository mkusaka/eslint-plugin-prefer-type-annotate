import { RuleTester } from "eslint";
import path from "path";

import { preferTypeAnotation } from "../../src/rules/prefer-type-annotation";

const tester = new RuleTester(
  {
    parserOptions: {
      ecmaVersion: 2015,
      project: path.resolve(__dirname, "..", "tsconfig.test.json")
    }
  }
);

tester.run("no-literal", preferTypeAnotation, {
  valid: [{ code: `let x` }],
  invalid: [
    {
      code: `const x = 1;`,
      errors: [{ message: "hi" }],
    },
  ],
});
