---
title: Rails+MySQLをalpineで構築する
date: 2021-09-17
categories: 技術
tags: [knowledge]
---

# イメージは軽いほど良い

動作が軽くなることは勿論、セキュリティリスクの軽減にも繋がる。

ということでalpineイメージでの構築を試みる。

# 前準備

公式チュートリアルを参考に、必要なファイルを揃える。

https://docs.docker.com/samples/rails/

Gemfile
~~~ruby
source 'https://rubygems.org'
gem 'rails', '~>6'
~~~

Gemfile.lock
~~~
$ touch Gemfile.lock
~~~

entrypoint.sh
~~~bash
#!/bin/bash
set -e

# Remove a potentially pre-existing server.pid for Rails.
rm -f /myapp/tmp/pids/server.pid

# Then exec the container's main process (what's set as CMD in the Dockerfile).
exec "$@"
~~~

Dockerfile
~~~md
FROM ruby:3.0.2-alpine

WORKDIR /myapp
COPY Gemfile Gemfile.lock /myapp/

RUN apk add --no-cache -t .build-dependencies \
    alpine-sdk \
    build-base \
 && apk add --no-cache \ 
    bash \
    mysql-dev \
    nodejs \
    tzdata \
    yarn \
 && gem install bundler:2.0.2 \
 && bundle install \
 && apk del --purge .build-dependencies

COPY . /myapp

# Add a script to be executed every time the container starts.
COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]
EXPOSE 3000

# Configure the main process to run when running the image
CMD ["rails", "server", "-b", "0.0.0.0"]
~~~

ビルドにしか使わないライブラリは最後に消去している。

docker-compose.yml
~~~yml
version: "3.9"
services:
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: password
      TZ: "Asia/Tokyo"
    volumes:
      - mysql-data:/var/lib/mysql
  web:
    build: .
    command: bash -c "rm -f tmp/pids/server.pid && bundle exec rails s -p 3000 -b '0.0.0.0'"
    volumes:
      - .:/myapp
    ports:
      - "3000:3000"
    depends_on:
      - db
volumes:
  mysql-data:
    driver: local
~~~

# ビルド

~~~
$ docker-compose run --no-deps web rails new . --force --database=mysql
$ docker-compose build
~~~

ビルドは成功したが、webコンテナ立ち上げ時にエラーが。

~~~
No such file or directory @ rb_sysopen - /myapp/config/webpacker.yml (RuntimeError)
~~~

webpackerは自分で整備する必要があるらしい。

~~~
$ docker-compose run --rm web rails webpacker:install
~~~

これで上手くいった。後はいつものDB設定して、完了。

https://docs.docker.com/samples/rails/#connect-the-database

https://i.imgur.com/6dBiuTP.png
フルイメージ時と比べて1/3くらいのサイズになった

# リポジトリ

https://github.com/hukurouo/rails-alpine-sandbox