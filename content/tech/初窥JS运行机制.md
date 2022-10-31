---
title: 初窥JS运行机制
date: 2022-07-19T22:51:22+08:00
category: 
  - Tech
tags: []
description: "JavaScript是单线程，通过事件循环机制来处理异步操作"
cover: "https://s2.loli.net/2022/07/20/wlOdJtpFgi51Wkr.png"
toc: true
---

>JavaScript的主要用途是与用户互动和操作DOM。这决定了它只能是单线程，否则会带来很复杂的同步问题。假设线程A在某个DOM节点上添加内容，而线程B删除了该节点，这就涉及到了竞争问题，需要引入锁机制，导致问题变得复杂。


## 异步(asynchronous) & 同步(synchronous) 


>优先关系：异步任务要挂起，先执行同步任务，同步任务执行完毕才会响应异步任务。

![](https://s2.loli.net/2022/07/20/wlOdJtpFgi51Wkr.png)



### 同步任务

- 输出
- 变量声明
- 同步函数


### 异步任务

异步任务
- setTimeout和setInterval
- DOM事件
- Promise
- process.nextTick
- fs.readFile
- http.get
- 异步函数：如果在函数返回的时候，调用者还不能够得到预期结果，而是需要在将来通过一定的手段得到，那么这个函数就是异步的。


## 宏任务(macro-task) & 微任务(micro-task)

>在一次事件循环中，先执行宏任务队列的一个任务，然后将微任务队列中的所有任务执行，再执行下一个宏任务

![](https://s2.loli.net/2022/07/19/DwlOqXyFNh6bsZK.png)


### 宏任务

>整块代码块进入执行栈的行为就是一个宏任务

- script全部代码
- I/O
- setTimeout
- setInterval
- setImmdiate
- requestAnimationFrame

### 微任务

- process.nextTick
- Promise
- Promise.then
- MutationObserver

### setTimeout运行机制

setTimeout 的运行机制是将指定的代码块移出本次执行，WEB API通过定时器，经过指定的时长后，将其回调函数加入宏任务队列。

setTimeout指定的函数代码块，必须等到本次执行的所有同步代码都执行完，才会执行， 尽管时间设定为0。

![](https://s2.loli.net/2022/07/19/MWQ3erwBVygsHLd.png)


最后来看一段代码：
```js
console.log(1)

setTimeout(() => {
  console.log(2)
}, 0)

new Promise((resolve) => {
  resolve()
}).then(() => {
  console.log(3)
})

console.log(4)
```

为什么输出顺序会是——`output`:1 4 3 2


一共有两次Event Loop:
1. 代码块进入执行栈，第一次**Event Loop**，执行第一个宏任务
2. 执行`console.log(1)`
3. 经过0s，`setTimeout`的回调函数被加入宏任务队列
4. `New Promise`，执行resolve，`Promise.then`是微任务，进入微任务队列
5. 执行`console.log(4)`，此时执行栈空
6. 检查微任务队列，执行所有微任务，这里只有一个`Promise.then`，执行`console.log(3)`
7. 执行完所有微任务，进入第二次**Event Loop** ，执行宏任务队头的setTimeout的回调`console.log(4)`




## 变量提升 & 函数提升 (Hoisting)

>JavaScript 和其他语言一样，都要经历**编译**和**执行**阶段。在编译阶段，JS 引擎会搜集所有的变量声明，并且提前让声明生效。
>而剩下的语句需要等到执行阶段、等到执行到具体的某一句时才会生效。这就是变量提升背后的机制。


### 变量

>变量会提升到其所在函数（作用域）的最上面。

```js
console.log(num) 
var num = 1
```

等价于

```js
var num
console.log(num)
num = 1
```

输出`undefined`

### 函数

>函数声明会被提升，但函数表达式不会被提升。

#### 函数声明

```js
fn()
function fn() {
	console.log(1)
}
```
<=>
```js
function fn() {
	console.log(1)
}
fn()
```

函数声明会被整个地提升到了当前作用域的顶部，输出`2`


#### 函数表达式

```js
fn()
var fn = function () {
	console,log(1)
}
```
<=>
```js
var fn
fn()
fn = function () {
	console,log(1)
}
```

报错`TypeError: fn is not a function`


### 同名变量和函数

>函数提升优先级高于变量提升

```js
console.log(foo)
console.log(foo())
var foo = 1;
function foo() {
  console.log(2)
}
console.log(foo)
```
<=>
```js
function foo() {
  console.log(2)
}
var foo
console.log(foo)
console.log(foo())
foo = 1
console.log(foo)
```

输出`[Function: foo]`  `2`  `undefined`  `1`


## 参考资料

- https://juejin.cn/post/6844903805063004167
- https://github.com/TigerHee/shareJS/blob/master/js/%E5%AE%8F%E4%BB%BB%E5%8A%A1%E4%B8%8E%E5%BE%AE%E4%BB%BB%E5%8A%A1.md
- https://dev.to/lydiahallie/javascript-visualized-event-loop-3dif
- https://zhuanlan.zhihu.com/p/88510041
- https://juejin.cn/post/7007224479218663455