---
title: 競馬予想するやつを作った
date: 2021-09-18
categories: 技術
tags: [tukutta]
---

4月頃から競馬を見るようになり、現在進行形でめちゃくちゃハマっている。

しかし全然馬券が当たらないので機械に予想させることにした。

# データを集める

なにはともあれデータが必要。netkeibaをスクレイピングして過去のデータを収集する。ログインが必要な画面もあったので、`mechanize`を利用した。

https://github.com/sparklemotion/mechanize

コードはこんな感じ。

~~~ruby
def login
  agent = Mechanize.new
  login_page = agent.get("https://regist.netkeiba.com/account/?pid=login")
  form = login_page.forms[1]
  form["login_id"] = ENV["ID"]
  form["pswd"] = ENV["PASS"]
  form.submit()
  agent
end

def get_data_logined_page(url,agent)
  page = agent.get(url)
  table = page.xpath('//table[@class="db_h_race_results nk_tb_common"]/tbody/tr')
  name = page.xpath('//div[@class="horse_title"]').css('h1').text.strip.gsub(/[[:space:]]/, '')
  table.each_with_index do |tr, index|
    tr.css('td').each_with_index do |td, index|
      (略)
    end
    @race_results.push tds if flag
  end
  write()
end
~~~

# 予想モデルを考える

まず思いついたのが、過去10年の1,2,3着馬の戦績を調べてその戦績に近い馬を評価するという方法。これを全重賞レースで行った。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">G3レースも追加した<br>結局単勝が一番回収率ありそうだ <a href="https://t.co/sSFkU6zSBD">pic.twitter.com/sSFkU6zSBD</a></p>&mdash; ⌨️ (@hukurouo_code) <a href="https://twitter.com/hukurouo_code/status/1394672923646955520?ref_src=twsrc%5Etfw">May 18, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

これに騎手成績、枠順評価、持ちタイム、開催場傾向を加えて、第一の予想モデルを構築した。この予想は4か月前くらいから下記のページで公開している。

https://keiba.hukurouo.com

回収率は一番高いので85%くらいで落ち着いている。

# 機械学習に手を出す

ざっと調べた感じ、SDG Regressor（回帰分析）が合っていそうだったのでPythonのライブラリ`scikit-learn`を使って予想してみた。

が、的中率ばかり高くなり、回収率が全く上がらず頓挫した。例えば的中率上昇に一番関与するパラメータはパドック予想値だったが、大体選ばれるのは人気馬なので（あるいは選ばれた馬が人気になる）当たりはするものの払い戻しが少なすぎるという問題にぶち当たる。穴馬を狙うというか、どれだけ妙味ある馬券を買えるか、というのが肝っぽいのだが、それを上手く機械学習に落としこむことが出来なかった。

# 結局は

他にも調教データをメインにした予想、データ分析による勝率のみを考慮した平場予想など色々と試してみたものの、一番最初に考えた第一モデルが一番回収率が出るという結果になった。

手は出し尽くしたかなという感じなので、この記事を書くことで仕切りとする。そしてこれは元も子もないのだけど、結局は自分であーだこーだと予想するのが一番楽しいということに気づいてしまった。

とはいえ、シミュレーション的な面白さがあるので、機械予想は続けようと思っている。今は半自動で予想を出力しているけど、気が向いたら全自動で動くようにしたい。

https://keiba.hukurouo.com