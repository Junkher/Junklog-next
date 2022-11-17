---
title: 从零点五开发一个Vuepress主题？
date: 2022-09-30T19:15:21+08:00
description: "其器钝，换之"
cover: "https://s2.loli.net/2022/11/17/dlzuhiRajGfSPAM.png"
toc: true
---

## Motivations

- 喜新厌旧
- [HUGO](https://gohugo.io/)很好，但无法使用框架，并且社区不够繁荣

## Why VuePress

- 足够轻量化
- 服务端渲染
- Contributors很活跃
- 支持插件，比起VitePress可拓展性强

## How 

即便VuePress的[文档](https://v2.vuepress.vuejs.org/guide/)可以说是业界楷模，但也无法详尽至面面俱到。
所以coding阶段，`coding === read + copy + write`。

第一步是读代码，并结合文档来理解架构、API以及LifeCycle Hooks;
第二步抄代码，模仿官方以及其他主题开发者的写法;
第三步才是写代码，在原型上增加新的Feature。

> 其实最磨人的并不是coding，而是config以及因为config导致的问题。VuePress2现在是Beta阶段，很可能会出现因为dependeies version导致的bug。别问，问就是痛过。


## To be solved

### not callable

tsconfig.json中设置`moduleResolution:NodeNext` 时就会导致原本可调用的函数报错`This expression is not callable.`，
大概率是`tailwindcss`模块本身导出的类型问题，因为`autoprefixer`并无报错信息。

- https://github.com/tailwindlabs/tailwindcss/discussions/9470

### hydration failed

`hydration`是vue服务端渲染（SSR）专用的术语，中文翻译为激活。
这个问题出现在当我将vuepress部署到vercel上之后，添加完自定义域名，访问该自定义域名时控制台的报错信息为`Hydration completed but contains mismatches.`
但直接访问**.vercel.app却没有任何报错信息。
那么合理推测问题就出现在我新添加的域名上面，而我所能想到的解释是这个域名之前为了方便管理，通过CloudFlare做了一次代理。
而当Proxy Status设置为`DNS only`后，或者不经过CF，一切恢复了正常。
虽然问题解决了，但仍未弄清出现问题的根源，Mark一下。

- https://www.51cto.com/article/701710.html
- https://github.com/quasarframework/quasar/discussions/10805
- https://www.sumcumo.com/en/understand-and-solve-hydration-errors-in-vue-js


## Notes

### CSS

#### transition-delay

纯css优雅实现悬停菜单，"the power of transition-delay"

>Note:  transition-delay写于transition前失效。

```scss
  transition: all .3s ease-in;
  transition-delay: 3000ms;
```


#### animation & keyframes

实现鼠标悬停无限旋转动画
```scss
.any-class {
   &:hover{
     opacity: 1;
     animation: rotating 2s linear infinite;
   }
}

@keyframes rotating {
  0%{ transform: rotate(0deg);}
  50%{ transform: rotate(180deg);}
  100%{ transform: rotate(360deg);}
}
```


#### nth-child

>The nth-child selector counts siblings

若使用`nth-child(1)`必须保证无其他兄弟节点


#### z-index

只有当`position: relative/fixed/absolute`才生效

### TS/JS

#### debounce

防抖函数的应用场景是连续事件的响应只需执行一次回调，防止高频重复调用。

一个TS适用的防抖函数，也可以用`ts-debounce`包
```ts
function debounce<T extends (...args: any[]) => any>(
  ms: number,
  callback: T
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timer: ReturnType<typeof setTimeout> | undefined

  return (...args: Parameters<T>) => {
    if (timer) {
      clearTimeout(timer)
    }
    return new Promise<ReturnType<T>>((resolve) => {
      timer = setTimeout(() => {
        const returnValue = callback(...args) as ReturnType<T>
        resolve(returnValue)
      }, ms)
    })
  }
}
```

#### propagation

译为(事件)传播，即是`event.stopPropagation`中的propagation，事件传播则分为往上冒泡和向下捕获，不得不说命名很贴切。

- bubbling(up)：当在一个元素上触发某个事件，首先会运行此元素与该事件绑定的handler，接着运行父元素的handler，一直向上作用完所有祖先。
- capturing(down)：与冒泡的过程相反。

propagation可以分为三个阶段 capturing (1), target (2) and bubbling (3) phases，下面是一个点击`td`元素的例子。

![](https://s2.loli.net/2022/11/17/jxpL4eIvlJNiFW9.png)



#### @mouse______

> 区别在于mouseenter/leave不会冒泡(bubble/propagate up)

- mousenter ：鼠标移入被选元素
- mouseleave：鼠标移出被选元素
- mouseover ：鼠标移入被选元素，移入和移出其子元素
- mouseout ：鼠标移出被选元素，移入和移出其子元素

#### undefined !== false

`undefined`跟`false`不能画等号，`false`是一个boolean object含有值为0，事实上是被定义过(defined)的。

#### typeof null

`typeof null === object`，初代JS的遗物

#### record<never, never>

可用于泛型赋默认值
```ts
export type PageDataRef<T extends Record<any, any> = Record<never, never>> = Ref<PageData<T>>
```

#### record<string, unknown>

用于需拓展未知属性的`object`，比如frontmatter中会存在用户自定义的属性，若未显式定义，则类型为`unknown`不导致报错。
```ts
export type PageFrontmatter<
  T extends Record<any, any> = Record<string, unknown>
> = Partial<T> & {
  date?: string | Date
  description?: string
  head?: HeadConfig[]
  lang?: string
  layout?: string
  permalink?: string
  permalinkPattern?: string | null
  routeMeta?: Record<string, unknown>
  title?: string
}
```

#### double question mark equals

`??=`可用于给有可能为`undefined`的变量赋值。
```ts
foo ??= 'bar'
/** 等价于 */
if (foo !== undefined) foo = 'bar' 
```

#### shims

> shim:   small object or piece of material used between two parts of something to make them fit together

`shims-xxx.d.ts`是一个很常见的文件名，比如`shims-vue.d.ts`
```ts
declare module '*.vue' {
  import type { ComponentOptions } from 'vue'
  const comp: ComponentOptions
  export default comp
}
```
**shim**这个单词很有意思，可译为垫片。这类文件的作用就是让tsc认识`import`的module。

#### Vue SSR

 > lifecycle hooks such as onMounted or onUpdated will NOT be called during SSR and will only be executed on the client.

VuePress无法在`setup()`阶段使用Browser/DOM APIs(比如全局变量`document`)，可以在`onBeforeMount()` 或 `onMounted()` hook中使用。

### Others

#### modify commit

1.  Show the last `n` commits in a text editor
```bash
git rebase -i "@~n"
```

> `@` is shorthand of HEAD, and `~` is the commit before the specified commit.

2. Modify `pick` to `edit` in the line mentioning the commit to be amended

3. Make changes and then commit --amend
```sh
git commit --amend --no-edit
```

4. Return back to the previous HEAD commit
```sh
git rebase --continue
```

#### npm publish

**Before publish** :

- 注册npmjs的账户，并确保邮箱已验证
- 更新npm
- 如果全局配置过registry的镜像地址，则需要改回`https://registry.npmjs.org`，或者在当前目录`.npmrc`中配置
- 通过`.npmrc`配置`authToken`避免重复繁琐登录
- 对于monorepo可以使用[`bumpp`](https://www.npmjs.com/package/bumpp)来修改`package.json`的version，并自动执行`script`

**How to publish** :

```bash
pnpm login
pnpm -r publish --tag <tag_name>
```

> warning: 非必须不要[unpublish](https://docs.npmjs.com/unpublishing-packages-from-the-registry)

#### pnpm patch

 魔改npm包：
1.  输入`pnpm patch <pkg name>@<version>`；
2.  会输出一行临时文件的目录`C:\Users\...\AppData\Local\Temp\path`，打开该目录，修改相关代码并保存；
3. `pnpm patch-commit C:\Users\...\AppData\Local\Temp\path`，会在workspace目录下的patches文件夹生成`.patch`文件。

#### package version

version的语义：`major.minor.patch`。若存在版本前缀`~ `和`^`，执行`pnpm install`后，可能无法保证前后版本一致，从而导致bug。

- `~version`： minor不变的当前最新版本
- `^version`： major不变的当前最新版本

# Refs

1. [vuepress-contributing](https://v2.vuepress.vuejs.org/contributing.html) 
2. [vuepress-architecture](https://v2.vuepress.vuejs.org/advanced/architecture.html) 
3. [iconify](https://icon-sets.iconify.design/)
4. [css-transition](https://juejin.cn/post/6970885478967050254)
5. [bubbling and capturing](https://javascript.info/bubbling-and-capturing)
6. [why typeof null === object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof#typeof_null)
7. [how to modify a specific commit](https://stackoverflow.com/questions/1186535/how-do-i-modify-a-specific-commit)
8. [difference between object and record<string, unknown>](https://www.reddit.com/r/typescript/comments/tq3m4f/the_difference_between_object_and_recordstring/)
9. [publish a vue component](https://www.youtube.com/watch?v=5QV9wVc8c7g)
10.  [ts-declaration](https://ts.xcatliu.com/basics/declaration-files.html)