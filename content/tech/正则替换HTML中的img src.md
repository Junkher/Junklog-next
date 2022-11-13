---
title: 正则替换HTML中的img src
date: 2022-07-20T18:21:45+08:00
tags: []
description: ""
draft: true
---


https://segmentfault.com/q/1010000004178052

```js

var str = "Hello World Hello World";
var str2 = str.match('lo');//regexp
console.log(str2);//["lo", index: 3, input: "Hello World Hello World", groups: undefined]

```


```js

content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match) {
  console.log(match);
});

```

```js
const regexp = /t(e)(st(\d?))/g;
const str = 'test1test2';

const array = [...str.matchAll(regexp)];

console.log(array[0]);
// expected output: Array ["test1", "e", "st1", "1"]

console.log(array[1]);
// expected output: Array ["test2", "e", "st2", "2"]

```

https://regexr.com/


## 正则替换换行符

```js
string.replace(/[\n\r]/g, ' ')
```



## vscode snake_case转camelCase


https://stackoverflow.com/questions/45461560/how-to-change-lower-case-to-upper-using-regular-expressions-in-visual-studio-cod

```
_([a-z]{1})

\U$1
```
