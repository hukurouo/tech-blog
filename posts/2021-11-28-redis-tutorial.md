---
title: Docker環境のRailsにredisを導入する
date: 2021-11-28
categories: 技術
tags: [knowledge]
---

備忘録です。

## 導入

docker-compose.yml
~~~yml
web:
  ...
  environment:
    ...
    REDIS_URL: redis:6379

redis:
  image: redis:6.2.6-alpine
  ports:
    - '6379:6379'
  volumes:
    - redis-data:/var/lib/redis

volumes:
  mysql-data:
    driver: local
  redis-data:
~~~

Gemfile
~~~rb
gem 'redis-rails'
~~~

## 疎通の確認

webコンテナにredisをインストールして、
~~~
bash-5.1# apk --update add redis
~~~

web-redis間で疎通してみる　

~~~md
bash-5.1# redis-cli -h redis
redis:6379> SET mykey "hello"
OK
redis:6379> GET mykey
"hello"
redis:6379> quit
bash-5.1# 
~~~

OK

## Rails内で疎通してみる

config/initializers/redis.rb

~~~rb
Redis.current = Redis.new(url: "redis://#{ENV['REDIS_URL']}")
~~~

ElastiCacheとかと接続するときはURL形式になるので、`REDIS_URL`で環境変数を持つと楽。

~~~rb
irb(main):004:0> Redis.current.set("mykey", "helllllo", ex: 30) # 30秒期限でmykeyをset
=> "OK"
irb(main):005:0> Redis.current.get("mykey")
=> "helllllo"
irb(main):006:0> Redis.current.pttl("mykey") # .pttl は指定したkeyの残り秒数をmillisecondsで返す
=> 4284
irb(main):007:0> Redis.current.pttl("mykey")
=> -2
irb(main):008:0> Redis.current.get("mykey") # 揮発した
=> nil
~~~

## hash形式で値をセットする


~~~rb
irb(main):005:0> Redis.current.hset("hash1",{key1: 1, key2: 2}) # hashのセット
=> 2
irb(main):008:0> Redis.current.hget("hash1", "key1") # hashのkeyを指定して値を取得
=> "1"
irb(main):009:0> Redis.current.hgetall("hash1") # hashをまるごと取得
=> {"key1"=>"1", "key2"=>"2"}
~~~

参考
- https://www.rubydoc.info/github/redis/redis-rb/Redis:hset
- https://www.rubydoc.info/github/redis/redis-rb/Redis:hget
- https://www.rubydoc.info/github/redis/redis-rb/Redis:hgetall