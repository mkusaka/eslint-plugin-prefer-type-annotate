import { tsIndexSignature } from "./ts-index-signature";

import { RuleTester } from "../test-utils";

const ruleTester = new RuleTester({
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2015,
  },
});

ruleTester.run("ts-index-signature", tsIndexSignature, {
  valid: [
    {
      code: `interface Foo {
  [key: string]: string;
}`,
    },
    {
      code: `type Bar = {
  [key: string]: string;
};`,
    },
    {
      code: `interface NestedFoo {
  [key: string]: {
    [key: string]: string;
  };
}`,
    },
    {
      code: `type NestedBar = {
  [key: string]: {
    [key: string]: string;
  };
};`,
    },
  ],
  invalid: [
    {
      code: `interface Foo {
  [key: string]: any;
}`,
      errors: [
        {
          messageId: "TSIndexSignature",
        },
      ],
    },
    {
      code: `type Bar = {
  [key: string]: any;
};`,
      errors: [
        {
          messageId: "TSIndexSignature",
        },
      ],
    },
    {
      code: `interface NestedFoo {
  [key: string]: {
    [key: string]: any;
  };
}`,
      errors: [
        {
          messageId: "TSIndexSignature",
        },
      ],
    },
    {
      code: `type NestedBar = {
  [key: string]: {
    [key: string]: any;
  };
};`,
      errors: [
        {
          messageId: "TSIndexSignature",
        },
      ],
    },
    // should we support this pattern?
    //     {
    //       code: `type Any = any;
    // interface Foo {
    //   [key: string]: Any;
    // }`,
    //       errors: [
    //         {
    //           messageId: "TSIndexSignature",
    //         },
    //       ],
    //     },
  ],
});
