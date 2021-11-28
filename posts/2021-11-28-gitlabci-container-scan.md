---
title: Gitlab CI/CD でコンテナスキャン
date: 2021-11-28
categories: 技術
tags: [knowledge]
---

Gitlab CI/CD の推奨スキャナーである [Trivy](https://github.com/aquasecurity/trivy) を利用して、CI/CDパイプラインでコンテナスキャンを行う。

https://docs.gitlab.com/ee/user/application_security/container_scanning/

gitlab-ci.yml
~~~yml
build:
  image: docker:18.09.7
  stage: build
  variables:
    DOCKER_HOST: tcp://docker:2375
    IMAGE: $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  services:
    - docker:18.09.7-dind
  script:
    - docker info
    - echo ${CI_JOB_TOKEN} | docker login -u ${DOCKER_ENV_CI_REGISTRY_USER} --password-stdin ${DOCKER_ENV_CI_REGISTRY}
    - docker build -f deploy/development/Dockerfile -t $IMAGE .
    - docker push $IMAGE

# https://github.com/aquasecurity/trivy-ci-test/blob/main/.gitlab-ci.yml
Trivy_container_scanning:
  stage: test
  image:
    name: alpine:3.11
  variables:
    # Override the GIT_STRATEGY variable in your `.gitlab-ci.yml` file and set it to `fetch` if you want to provide a `clair-whitelist.yml`
    # file. See https://docs.gitlab.com/ee/user/application_security/container_scanning/index.html#overriding-the-container-scanning-template
    # for details
    GIT_STRATEGY: none
    IMAGE: $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  before_script:
    - export TRIVY_VERSION=${TRIVY_VERSION:-v0.19.2}
    - apk add --no-cache curl docker-cli
    - docker login -u "$CI_REGISTRY_USER" -p "$CI_REGISTRY_PASSWORD" $CI_REGISTRY
    - curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin ${TRIVY_VERSION}
    - curl -sSL -o /tmp/trivy-gitlab.tpl https://github.com/aquasecurity/trivy/raw/${TRIVY_VERSION}/contrib/gitlab.tpl
  script:
    - trivy --exit-code 0 --cache-dir .trivycache/ --no-progress --format template --template "@/tmp/trivy-gitlab.tpl" -o gl-container-scanning-report.json $IMAGE
  cache:
    paths:
      - .trivycache/
  dependencies: []
  only:
    refs:
      - branches
  artifacts:
    paths:
      - gl-container-scanning-report.json
    expire_in: 1 week
~~~

コンテナスキャン結果はCI画面からダウンロードしたり、Gitlab Pages で公開することができる。