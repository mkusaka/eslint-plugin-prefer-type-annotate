# eslint-plugin-prefer-type-annotate

Prefer add annotate if `any` inference eslint rule.

## install

type anotate

```bash
npm install --save-dev @mkusaka/eslint-plugin-prefer-type-annotate
```

```bash
yarn add -D @mkusaka/eslint-plugin-prefer-type-annotate
```

## Motibation

For cases when the noInplicitAny CompileOption off ts environment, function or variable declaration are sometime infer to `any` type.

Since `any` type is very dangirous (it brake TypeScript typesystem..), most of TypeScript developer want to enable `noImplicitAny` compiler option.

So, some project, like gradually converting from js to ts all project files, must annotate implicit any `before` noImplicitAny to true.

To detect no implicit any and destroy it gradually, eslint is best solution of that. But, there is no good rule for this problem. (typedef rule can't detect inferred type information.)

## Rule Details

Examples of **incorrect** code for this rule:

```ts
let a;

const b = (c, d) => c + d

function e(f, g) {
  return f / g
}
```

Examples of **correct** code for this rule:

```ts
let a: string

const b = (c: number, d: number) => c + d

function e(f: number, g: number) {
  return f / g
}
```
