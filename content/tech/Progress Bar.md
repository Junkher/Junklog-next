---
title: Progress Bar
date: 2022-07-09T01:55:07+08:00
tags: []
description: "如何花里胡哨实现阅读进度条？"
cover: "https://s2.loli.net/2022/07/09/THfrMYiXnzQVCdJ.png"
---

## 基本思路

>进度条看成是一个有背景颜色的div元素，通过js监听滚动条所在的位置来改变元素的宽度，从而实现阅读进度条。

### html（tailwindcss）

- fixed top-0: 固定在顶部
- bg-gradient-to-r：进度条颜色

```css
<div id="progress-bar" 
	 class="fixed top-0 h-1 bg-gradient-to-r from-violet-500 to- fuchsia-500" 
     style="--scrollAmount: 0%; width: var(--scrollAmount)">
</div>
```

### js

- `docElem['scrollTop'] || docBody['scrollTop']`：提高兼容性，获取滚动条滚过的长度
- scrollBottom：得到的是滚动条的能滚的最长长度，通过整个页面的高度减去窗口高度得到
- scrollPercent：计算百分比，赋值给progress-bar的scrollAmount

```js
let processScroll = () => {
  let docElem = document.documentElement,
      docBody = document.body,
      scrollTop = docElem['scrollTop'] || docBody['scrollTop'],
      scrollBottom = (docElem['scrollHeight'] || docBody['scrollHeight']) - window.innerHeight,
      scrollPercent = scrollTop / scrollBottom * 100 + '%';
  
  // console.log(scrollTop);
  // console.log(scrollBottom);
  // console.log(window.innerHeight);
  // console.log(scrollPercent);
  document.getElementById('progress-bar').style.setProperty('--scrollAmount', scrollPercent);
}


document.addEventListener('scroll', processScroll);
```

## Linear-gradient

另一种可行的方案是不断修改background的线性渐变颜色中转点的值。

```html
<div id="progress-bar" class="fixed top-0 right-0 h-1" 
	 style="background:linear-gradient(to right, #4dc0b5 var(--scrollAmount), transparent 0);"></div>
```


## Progress标签

使用[progress](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/progress), 通过js根据滚动百分比动态调整value的值即可
- max：描述了这个progress元素所表示的任务一共需要完成多少工作。
- value：指定该进度条已完成的工作量。

```html
<progress class="h-1 fixed top-0" value="0" max="100"></progress>
```

```js
document.querySelector("progress").value = scrollTop / scrollBottom * 100
```


## 纯CSS实现

还有一种惊为天人的纯CSS的实现方式，[参考代码](https://codepen.io/ricardpriet/pen/RjXdPa)
使用::before和::after伪元素，::before下三角填满颜色，然后把::after当成遮罩，从而实现进度条的效果。

```css
.x::before {
  display: block;
  content: "";
  background-image: linear-gradient(to right top, #CDDC39 0%, #03A9F4 50%, #fff 50%);
  position: absolute;
  height: calc(100% - 100vh + 5px  );
  width: 100%;
}

.x::after {
  display: block;
  content: "";
  position: sticky;
  position: -webkit-sticky;
  background: #e6f0f5; 
  height: calc(100vh - 5px);
  bottom: 0;
  left: 0;
}

```

将::after中的bg-color注释掉后实质上::before的样子
![](https://s2.loli.net/2022/07/09/THfrMYiXnzQVCdJ.png)


