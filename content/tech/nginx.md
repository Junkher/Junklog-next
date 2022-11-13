---
title: nginx
date: 2022-08-31T17:19:29+08:00
tags: []
description: ""
cover: ""
draft: true
---


![](https://s2.loli.net/2022/08/31/4NdEAVRsKhXM1iS.png)


![](https://s2.loli.net/2022/08/31/SlYXDVqGg31IZ5a.png)


## Proxy vs Reverse Proxy

>client通过proxy访问server，server不知道是哪个client请求
>而反向代理，则是当client请求某个资源，proxy可能转发给不同的server


## directives

` $remote_addr`获得上游的IP地址，`$proxy_add_x_forwarded_for`获得最初的remote_addr，即真实客户端的IP地址

```
proxy_set_header   Host $host;
proxy_set_header   X-Real-IP $remote_addr;
proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header   X-Forwarded-Host $server_name;
```


