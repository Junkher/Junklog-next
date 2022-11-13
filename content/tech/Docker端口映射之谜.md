---
title: Docker端口映射之谜
date: 2022-07-19T22:58:51+08:00
tags: []
description: ""
draft: "true"
---

## Port Mapping

如何正确的配置端口映射？

每个container都相当于一个host，postgres-server是在host的5432端口，因此需要将5432映射到0.0.0.0:5437或者其他端口才有效。

```
 docker run -d --name postgres-server -p 5437:5432 -e "POSTGRES_PASSWORD=hasura123" postgres
```

```

```


```
$ docker port postgres-server
5432/tcp -> 0.0.0.0:5437
5432/tcp -> :::5437
```

![](https://s2.loli.net/2022/07/14/S4KfhtRYPZ3BVWp.png)


尝试连接
```
psql -h 127.0.0.1 -p 5437 -U postgres
```

https://www.cloudbees.com/blog/docker-expose-port-what-it-means-and-what-it-doesnt-mean

```sh
docker image inspect <image_name> -f '{{ .ContainerConfig.ExposedPorts }}'
```

https://dzone.com/articles/how-to-nginx-reverse-proxy-with-docker-compose


```sh
docker logs container-name
```


## restart 和 up&down

实践证明，如果没有改动docker-compose.yml而只是修改配置文件，则可以通过restart使其生效


## master process & worker process


##  volume

http://docker.baoshu.red/data_management/volume.html

>Docker mounts your host folder in the container folder you specify
the empty

https://stackoverflow.com/questions/42395748/docker-compose-volume-is-empty-even-from-initialize

```
docker cp nginx_0:/usr/share/nginx/html ./docker-nginx 
docker cp nginx_0:/etc/nginx ./docker-nginx 
```


### back_up

https://www.youtube.com/watch?v=ZEy8iFbgbPA

```sh
docker run --rm --volumes-from CONTAINER -v $(pwd):/backup busybox tar cvfz /backup/backup.tar CONTAINERPATH
```

将volume的_data中的文件压缩为backup.tar
```sh
tar -cvfz ~/backup/data_backup.tar /var/lib/volumes/VOLUME_NAME/_data/
```

将_data的内容解压缩到新建的volume中
```sh
tar -xvf data_backup.tar -C /var/lib/docker/volumes/VOLUME_NAME
```

## exec

```sh
docker exec -it nginx nginx -s reload
```