---
title: 从零开发一个Hugo主题？
date: 2022-07-09T22:48:50+08:00
tags: []
description: "工欲善其事，必先利其器"
cover: "https://s2.loli.net/2022/11/17/SEWVJeAvQroZuYL.png"
toc: true
---

## Todo

- [x] 目录页面使选中目录active
- [ ] 添加Category和Tag机制
- [x] 自定义ListCards的图片
- [x] LightMode样式适配

## Why

- Meme确实符合我的审美，但自定义的Theme才是坠吊的
- 整合Obsidian和Hugo，实现本地Ob写作，一键推送部署Hugo
- 吃饱了撑的（：


## How

- Hugo
	- Tailwndcss
	- DaisyUI
	- Typography
	- Git workflow

- Obsidian
	- QuickAdd
	- Image auto upload Plugin
	- PicGo
	- Obsidian Git

## Hugo

### 基本命令

新建一个新的空白站点
```
hugo new site demo
```

新建新的主题模板（以后可能会用，用于打包成别人可用的主题）
```
hugo new theme hugo-my-theme
```

如果是使用新建主题，须在`config.toml`要加上
```
theme = "hugo-my-theme"
```


### 项目结构

#### content

```
.
└── content
    └── about
    |   └── index.md  // <- https://example.com/about/
    ├── posts
    |   ├── firstpost.md   // <- https://example.com/posts/firstpost/
    |   └── secondpost.md  // <- https://example.com/posts/secondpost/
    └── quote
        ├── first.md       // <- https://example.com/quote/first/
        └── second.md      // <- https://example.com/quote/second/
```

![](https://s2.loli.net/2022/07/09/ijfak6GqEnxXFJI.png)



#### layout
![](https://s2.loli.net/2022/07/09/SU34CdpbYFZmTX5.png)



- baseof.html：所有页面的基础，`{{- block "main" . }}{{- end }}`相当于预留一个插槽，放置`{{ define "main" }}{{end}}`。
```html
<!DOCTYPE html>
<html>
    {{ partial "head.html" . }}
    <body>
        {{ partial "header.html" . }}
        
        <div id="content">
        {{- block "main" . }}{{- end }}
        </div>
        
        {{ partial "footer.html" . }}
      </body>
</html>

```

- list.html：目录(Section)，`{{.Content}}`是目录下_index.md的内容，若没有则不会渲染， `{{ range .Pages }}`遍历目录下的子页面，`{{.Permalink}}`对应子页面的路径。
```html
{{ define "main" }}
<main>
    <article>
        <header>
            <h1>{{.Title}}</h1>
        </header>
        <!-- "{{.Content}}" pulls from the markdown content of the corresponding _index.md -->
        {{.Content}}
    </article>
    <ul>
    <!-- Ranges through content/posts/*.md -->
    {{ range .Pages }}
        <li>
            <a href="{{.Permalink}}">{{.Date.Format "2006-01-02"}} | {{.Title}}</a>
        </li>
    {{ end }}
    </ul>
</main>
{{ end }}
```

- single.html: 子页面(Page)，每个`content/section/*.md`都会根据single.html渲染。`{{.Content}}`就是.md文件中的正文内容。

```html
{{ define "main" }}
{{/*  <p>{{ .Type }}</p>  */}}
	  <article>
        {{.Content}}
      </article>
{{ end }}
```


## TailwindCss

### 安装和整合

安装tailwindcss
```cmd
pnpm add tailwindcss
```

创建tailwind.config.js和postcss.config.js
```
pnpm tailwindcss init -p
```

修改tailwind.config.js中的content
```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["content/**/*.md", "layouts/**/*.html"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

postcss.config.js不动
```
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

新建assets/tw.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities
```

在partials/head.html引入tailwindcss， `out.css`是tailwindcss根据所有html中使用了的类生成的css文件
```html
<head>
  <title>Demo</title>
  {{ $style := resources.Get "css/out.css"}}
  <link rel="stylesheet" href="{{ $style.Permalink }}">
</head>

```

### Typography & DaisyUI

安装插件
```
pnpm add @tailwindcss/typography daisyui
```

在`tailwind.config.js`加入
```
  plugins: [
    require('@tailwindcss/typography'),
    require("daisyui"),
  ],
```


## Dev模式

Tailwind3默认JIT(Just-in-Time)模式，使用`--watch`参数可以实现热部署
```sh
pnpm tailwindcss -i ./assets/css/tw.css -o ./assets/css/out.css --watch
```

再打开另一终端，启动hugo服务器
```sh
hugo server
```

### 使用concurrently

在package.json中添加
```
  "scripts": {
    "dev:css": "pnpm tailwindcss -i ./assets/css/tw.css -o ./assets/css/out.css --watch",
    "dev:server": "hugo server",
    "dev": "concurrently \"pnpm dev:css\" \"pnpm dev:server\""
  }
```



## Vercel部署

1. 首先push到github仓库
2. 登录Vercel，导入该仓库
3. Vercel会自动检测出Hugo模板，点击Deploy即可

**Attention:**
- 手动设置Vercel的环境变量HUGO_VERSION为本地对应的最新版本
- config.toml中的`baseURL`设置为Vercel分配的域名，否则无法正确加载css文件


## 可以公开的情报

- hugo配置正则匹配忽略Ob模板文件

```
ignoreFiles = [ '模板\.md']
```

- `{{.Type}}` 

FrontMatter中的`type`，若无则默认是目录名，可用来实现返回到对应目录


## 可供参考的资料

### hugo主题开发
- https://gohugo.io/templates/introduction/
- https://lvv.me/posts/2019/11/24_a_simple_hugo_theme/
- https://www.youtube.com/watch?v=aSd_Ha5nDkM&t=496s

### Blog
- https://blog.imfing.com/2021/04/rebuild-personal-site-with-hugo-1/
- https://www.unsungnovelty.org/posts/03/2022/how-to-add-tailwind-css-3-to-a-hugo-website-in-2022/
- https://functional.style/hugo/general/tailwind/

### Theme
- https://github.com/cntrump/hugo-notepadium
- https://github.com/forecho/hugo-theme-echo



