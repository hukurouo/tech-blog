---
title: railsのフォームに初期値を入れる
date: 2021-09-03
categories: 技術
tags: [knowledge]
---

すごい初歩的なところで詰まってしまたったので備忘録。

フォームに初期値を入れると聞いて真っ先に浮かんだのがこれ。

~~~rb
<%= form.text_field :title, class: 'form-control', value: 'hoge' %>
~~~

これでも初期値は設定されるが、入力項目の不備でページが再描画されたときに、valueで指定した値で上書きされてしまう。ではどうするか。

~~~ruby
def new
  @article = Article.new
  @article.title = 'hoge'
end
~~~

コントローラーでインスタンス変数を宣言するときに代入してあげればよい。