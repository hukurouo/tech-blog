---
title: Docker環境のログローテーション
date: 2022-02-06
categories: 技術
tags: [knowledge]
---

何も設定しないと無限にログが溜まっていくので、`docker-compose.yml`で設定しておく。

~~~yml
logging:
  driver: json-file
  options:
    max-file: '1'
    max-size: 3m
~~~

