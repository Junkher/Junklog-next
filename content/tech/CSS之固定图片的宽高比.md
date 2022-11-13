---
title: CSS之固定图片的宽高比
date: 2022-08-03T00:07:16+08:00
tags: []
description: "利用padding-top/bottom的%{}特性"
cover: "https://s2.loli.net/2022/08/03/XIfxtmaiRvV3hCs.png"
---


## 看起来很简单，其实也很简单


>padding-top和padding-bottom这两个属性的百分号对应的是宽度(width)

思路就是，先定义一个固定宽高比的`div`元素，用来包裹图片，从而框定图片的大小，再用`img`图片填满该元素即可。举个例子，要实现图片固定宽高比4:3，并且要与父级元素之间留有边缘，如下所示。
![](https://s2.loli.net/2022/08/03/XIfxtmaiRvV3hCs.png)

###  tailwindcss写法

```html

<div class="relative pt-[60%] w-[80%] mt-[10%] mx-auto">
    <img src="{{.Params.cover}}" alt="Nothing" class="absolute top-0 left-0 rounded-xl object-cover w-full h-full" />
</div>

```

- `w-[80%]`+`mx-auto`：相当于在两侧留出10%父级元素宽度的margin
- `pt-[60%]`: 就是为了满足4:3的比例
- `absolute` `top-0`  `left-0` `w-full` `h-full`:  通过绝对定位让图片百分百填充到设置的框中
- `object-cover`: 保持图片的原有比例，但可能会导致部分不可见


### 传统css写法

```html
<div class="img-wrapper">
  <img src="{{.Params.cover}}" alt="Nothing"/> 
</div>
```

```css
.img-wrapper {
  position: relative;
  width: 100%;
  padding-top: 75%; /* 4:3 Aspect Ratio */
}

.img-wrapper img {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border-radius: 0.75rem;
}

```

## 参考资料

https://www.w3schools.com/howto/howto_css_aspect_ratio.asp
