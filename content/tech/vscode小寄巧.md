---
title: vscode小寄巧
date: 2022-07-19T22:55:49+08:00
tags: []
description: ""
draft: true
---

## 自定义Snippet

1. File->Preferenece->Configure User Snippets

![](https://s2.loli.net/2022/07/12/geZr6pU7fCSlXnY.png)

2.  选择全局配置文件
![](https://s2.loli.net/2022/07/12/TGoFRA6Jsr92WlS.png)

3. 将snippet模板添加到vue.json中

```json
	"vue3-ts": {
		// 前缀  也就是用户输入的快捷键内容
		"prefix": "vuets",
		// 输出内容
		"body": [
			"<!-- $0 -->",
			"<script setup lang='ts'>",
      "",
			"</script>",
      "",
      "<template>",
      "",
			"</template>",
			"",
			"<style>",
			"",
			"</style>",
			""
		],
		// 描述
		"description": "Vue ts component"
	}

```


## workspace插件设置

https://github.com/microsoft/vscode/issues/61723


## code-server

https://hub.docker.com/r/linuxserver/code-server