---
title: Rails6 + select2 で検索 & 複数選択ができるセレクトボックスの実装
date: 2022-02-06
categories: 技術
tags: [knowledge]
---

https://tech.hukurouo.com/articles/2021-11-28-rails-select-box

の続きです。

https://i.imgur.com/4OyIQOG.png

# 必要なライブラリをインストール

バージョンが合っていないと表示が崩れたりするのでご注意ください。

package.json

~~~json
{
  "name": "myapp",
  "private": true,
  "dependencies": {
    "@rails/actioncable": "^6.0.0",
    "@rails/activestorage": "^6.0.0",
    "@rails/ujs": "^6.0.0",
    "@rails/webpacker": "4.3.0",
    "@ttskch/select2-bootstrap4-theme": "^1.5.2",
    "bootstrap": "4.6.0",
    "jquery": "^3.6.0",
    "popper.js": "^1.16.1",
    "select2": "4.0.13",
    "turbolinks": "^5.2.0"
  },
  "version": "0.1.0",
  "devDependencies": {
    "webpack-dev-server": "^3"
  }
}
~~~

# 前設定

jsとcssを読み込んでおく

app\javascript\packs\application.js
~~~js
import Rails from "@rails/ujs"
import Turbolinks from "turbolinks"
import * as ActiveStorage from "@rails/activestorage"
import "channels"
import ('jquery')
import 'bootstrap'

Rails.start()
Turbolinks.start()
ActiveStorage.start()
~~~

app\assets\stylesheets\application.css
~~~css
 *
 *= require_tree .
 *= require_self
 *= require bootstrap/dist/css/bootstrap
 *= require select2/dist/css/select2
 *= require @ttskch/select2-bootstrap4-theme/dist/select2-bootstrap4
 */
~~~

## 検索 + 複数選択可能なセレクトボックスの実装

セレクトボックスの設定

app\javascript\packs\users\new.js
~~~js
import $ from 'jquery'
import 'select2'

$(function () {
  $('.js-searchable').select2({
    dropdownAutoWidth: true,
    placeholder: "検索語句を入力",
    allowClear: true,
    theme: 'bootstrap4'
  });
  
  $('.js-searchable-multiple').select2({
    dropdownAutoWidth: true,
    theme: 'bootstrap4',
    placeholder: "検索語句を入力",
    allowClear: true,
    multiple: true
  });
});
~~~

viewからjsを読み込む

app\views\users\new.html.erb
~~~erb
<div class="container">
    <h1>New User</h1>
    <%= render 'form', user: @user %>
    <%= link_to 'Back', users_path %>
</div>

<%= javascript_pack_tag 'users/new' %>
~~~

セレクトボックスを作成。classで`js-searchable-multiple`を指定する。

app\views\users\_form.html.erb
~~~rb
...
  <div class="form-group">
    <div class="row">
      <div class="col-md-6">
        <label class="pull-right control-label">タグ</label>
        <%= select_tag(:user_tags, options_for_select([['東京', 1], ['埼玉', 2],['神奈川', 3],['栃木', 4],['千葉', 5]]), class: 'form-control js-searchable-multiple', :multiple => true) %>
      </div>
    </div>
  </div>
...
~~~

## リポジトリ

https://github.com/hukurouo/rails-alpine-sandbox/pull/2