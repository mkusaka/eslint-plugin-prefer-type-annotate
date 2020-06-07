import { preferTypeAnnotation } from "./prefer-type-annotation";

import { RuleTester } from "../test-utils";

import path from "path";

const ruleTester = new RuleTester({
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2015,
    project: "tsconfig.json",
    tsconfigRootDir: path.resolve(__dirname, "..", ".."),
  },
});

ruleTester.run("prefer-type-annotation", preferTypeAnnotation, {
  valid: [
    {
      code: "const [a] = [1]",
    },
  ],
  invalid: [
    {
      code: "const [a] = [1 as any]",
      errors: [
        {
          messageId: "VariableDeclaratorArray",
        },
      ],
    },
  ],
});
