---
title: CNAME or A
date: 2022-07-10T09:41:52+08:00
category: 
  - Tech
tags: []
description: "白嫖的顶级域名怎么用"
cover: "https://s2.loli.net/2022/09/23/7I31gfCnxMeUKPw.png"
---

> 在博客搭建好之后，心满意足如沐春风，但当注意到网站那个非常ugly的域名(没错，说的就是vercel)，一定会产生要弄一个只属于自己的专属域名的想法。 尤其是*.vercel.app(反复鞭尸)已经被墙(DNS cache pollution)，这下是真的不得不使用自己的域名了。

## 白嫖顶级域名(root/apex domain)

良心DNS服务商[freenom](https://www.freenom.com/en/index.html?lang=en)，slogan是`A Name for Everyone`(它真的，我哭死)。

虽然都是一些岛国(地区)的域名，但毕竟是免费的，不能要求太多了。账号注册过程比较繁琐，不过要知道

> 很多时候，白嫖的本质就是用时间换金钱
> 														——沃兹基硕德

最多是一年的免费，但可以反复注册域名，并且好像没有限制数量。

![](https://s2.loli.net/2022/09/23/7I31gfCnxMeUKPw.png)

油管的教程 [Freenom account registration](https://www.youtube.com/watch?v=3Uopc4AFjOY)


## 配置DNS records

可以使用freenom提供的Nameserver，但同时它也允许配置使用自定义的Nameservers。虽然freenom很良心，但不得不说连接不太稳定，响应速度也比较慢，经常莫名其妙需要重新登录。

所以，我现在采取的方案是使用[Cloudflare](https://www.cloudflare.com/en-gb/)提供的Nameserver，然后在Cf里面进行DNS记录的更改配置，生效速度感人，另外Cf还有提供一些其他有用的功能（比如cdn缓存，隐藏源站IP）。

![](https://s2.loli.net/2022/09/23/IiDxS79Qw1EnvCb.png)


只需要在Cf添加域名，然后将Cf分配的Nameservers添加到freenom中，剩下的其他操作都只需要在Cf中进行。

![](https://s2.loli.net/2022/09/23/zPqK4YDxfjIR2lp.png)


在vercel里面添加新的域名，会显示无效配置，那么只需要根据提示在Cf的DNS管理界面进行相应的配置即可。

![](https://s2.loli.net/2022/09/23/E7uxbFckKBWs6z1.png)


## CNAME or  A

> 一个有意思的地方是，对于裸域名，需要绑定的是A记录，而子域名，则是绑定CNAME记录。

原因在于对于裸域名，还会存在NS(NameServer)、SOA(Start of Authority)、MX(Mail Exchanger)等记录，如果还设置了CNAME（RFCs state that once a record has a CNAME it can't have any other entries），就会导致冲突，使其他记录失效。

但Couldflare实现了CNAME flattening，简单来说就是，当裸域名存在CNAME时，Cf的DNS服务器会解析直到找到A记录然后返回对应的IP地址。

>What happens is that, if there's a CNAME at the root, rather than returning that record directly we recurse through the CNAME chain ourselves until we find an A Record. At that point, we return the IP address associated with the A Record. This, effectively, "flattens" the CNAME chain.


### A record (Addressl) 

A记录是存储域名和IP的映射关系，但一个域名可以对应多个IP地址(**负载均衡**)，不过，最后DNS只会解析到其中的一个IP。

### CNAME (Canonical)

CNAME记录是存储域名和域名之间的映射关系，从而使得多个域名可以访问同一个网站，并且当需要更换IP地址时就无须逐一改动。比如CDN就离不开CNAME。


## CDN(Content Delivery Network)

当用户请求访问某一网站时，DNS服务器通过CNAME 记录指向某CDN服务，能够告知离用户最近的的CDN节点，最后向该CDN节点请求内容，达到加速的效果（[一个较为完整的请求流程](https://www.huaweicloud.com/zhishi/cdn2.html)


![](https://s2.loli.net/2022/09/23/5rIqkzOEvxp4WBf.png)



## Ref

1. https://cloud.tencent.com/developer/article/1349559
2. https://www.noip.com/support/knowledgebase/what-is-the-difference-between-a-cname-record-a-record-and-redirect/
3. https://blog.cdemi.io/why-cant-you-have-a-cname-at-the-root-of-a-domain
4. https://blog.cloudflare.com/introducing-cname-flattening-rfc-compliant-cnames-at-a-domains-root/
5. https://superuser.com/questions/264913/cant-set-example-com-as-a-cname-record

