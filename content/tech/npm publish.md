---
title: npm publish
date: 2022-09-27T18:45:21+08:00
tags: []
description: ""
cover: ""
draft: true
---

- make sure email is verified
- update npm to  npm@latest


https://www.youtube.com/watch?v=5QV9wVc8c7g



## d.ts
https://www.typescriptlang.org/tsconfig#declaration


## shims-vue.d.ts  / vite-env.d.ts

```ts
/// <reference types="vite/client" />
/// <reference types="vue/macros-global" />


declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
```

> shim:   small object or piece of material used between two parts of something to make them fit together




## package参数解析

- export


## ~和^

