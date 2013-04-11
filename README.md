---
#ringCommand.js
---
##概要
jquery(+jqueryプラグイン)上で動作するリンクメニュー。
聖剣伝説のリングコマンドっぽいものを **HTML上に簡単に設置したい** という発想から作成しました。
また、現状はとりあえず動くことを確認した程度なので挙動が不安定かもしれません。

##必須プラグイン
+ [jquery.touchSwipe.js](https://github.com/mattbryson/TouchSwipe-Jquery-Plugin "スワイプなどのイベント取得のため")
+ [jquery.path.js](https://github.com/weepy/jquery.path "ブロックを曲線に沿って移動させるため")
+ [jquery.mouseWheel.js](https://github.com/brandonaaron/jquery-mousewheel "マウスホイールイベント取得のため")

##デモ
[sampleの中身](http://wahhaman.github.io/rc_js/sample/sample.html)

##操作方法(画面全域)
+ リングを開く
    * 右クリック(PC/閉状態)
    * ピンチイン(→ ←/iPhone/閉状態)
    * ロングタップ(PC・iPhone/閉状態)
+ リングを回す
    * マウスホイール(PC/開状態)
    * スワイプ(PC・iPhone/開状態)
    * 左右キー(PC/開状態)
+ 決定(フォーカスされているリンク)
    * ダブルクリック・ダブルタップ(PC・iPhone/開状態)
    * ロングタップ(PC・iPhone/開状態)
+ リングを切り替える
    * 右クリック(PC/開状態)
    * ピンチイン(→ ←/iPhone/開状態)
    * 上下キー(PC/開状態)
+ リングを閉じる
    * ピンチアウト(← →/iPhone/開状態)
    * Escキー(PC/開状態)

##version
0.2.0

##履歴
+ 2013/04/09 ver 0.2.0 複数リングの切り替え機能追加、githubに移行
+ 2013/04/05 ver 0.1.0 [自サイト](http://laymanscraft.net/rc_js/)で公開

##検証環境
windowsXP (IE8/Firefox/Chrome/Safari)
iPhone4S (Safari)

##問題点
+ 右クリック・ピンチなどの制御を奪うので使いどころが難しい
+ androidだと重そう