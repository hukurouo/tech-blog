---
title: Railsでテキストを改行させる
date: 2021-09-15
categories: 技術
tags: [knowledge]
---

~~~ruby
text = "テキスト\nテキスト2"
<%= simple_format(h(text), {}, wrapper_tag: "div") %>
~~~

# 何をやっているか

### simple_format

改行をpタグやbrタグで表現してくれるヘルパーメソッド。

### h

hオプションを`simple_format`に付け加えると、与えられたテキストに埋め込まれたhtmlタグがエスケープされる。


### option

`simple_format`はデフォルトでpタグで囲われるが、オプションでdivタグに変更したりもできる。デザインの調整をするときに意外と重宝する。

# 詳しくは

公式ドキュメントへ

https://apidock.com/rails/ActionView/Helpers/TextHelper/simple_format