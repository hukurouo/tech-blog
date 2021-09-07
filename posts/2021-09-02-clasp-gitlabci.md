---
title: gitlab CI/CDでclaspを自動デプロイする
date: 2021-09-02
categories: 技術
tags: [knowledge]
---

claspで開発環境と本番環境を分けると、デプロイする度に`clasp.json`を書き換えるのが面倒。

ということでCD環境を整備した。featureブランチにcommitされると開発環境に、masterブランチにcommitされると本番環境にデプロイされる。

.gitlab-ci.yml
~~~yml
image: node:latest

stages:
- deploy

cache:
  # ref: https://docs.gitlab.com/ee/ci/caching/#share-caches-across-jobs-in-different-branches
  key: one-key-to-rule-them-all
  # ref: https://docs.gitlab.com/ee/ci/caching/#cache-nodejs-dependencies
  paths:
    - .npm/

before_script:
  # Never hard-code .clasprc.json, EVER
  - echo $CLASPRC_JSON > ~/.clasprc.json
  - npm ci --cache .npm --prefer-offline

deploy_dev:
  stage: deploy
  script:
    - echo "{\"scriptId\":\"$SCRIPT_ID_DEV\",\"rootDir\":\"./src\"}" > .clasp.json
    - npm run clasp push
  only:
    - /^feature.*$/

deploy_prod:
  stage: deploy
  script:
    - echo "{\"scriptId\":\"$SCRIPT_ID_PROD\",\"rootDir\":\"./src\"}" > .clasp.json
    - npm run clasp push
  only:
    - master
~~~

認証情報などは環境変数に秘匿する。

`npm ci`というのは、CIに必要な最低限だけ`npm i`するコマンドらしい。便利だ。