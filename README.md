# bitzenyMobileMiner(Android)

## 利用環境

MacOS X / Windows

## 初期設定　Windows

1. [JDK](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)

- 上記インストール後、 `JAVA_HOME` 環境変数を登録する
- [参考](http://techfun.cc/java/windows-jdk-pathset.html)

2. [Ant](http://ant.apache.org/bindownload.cgi)
- 上記ダウンロード後、Cドライブ直下に置く (c:¥apache-ant-1.9.2¥bin)

3. [AndroidSDK](http://developer.android.com/sdk/index.html)
- 上記をインストール後、 `ANDROID_HOME` 環境変数を登録する
- 対象 `%ANDROID_HOME%¥tools` `%ANDROID_HOME%¥platform-tools`

## 実行方法

```
$ node -v
v8.9.4

$ sudo npm install -g ionic
$ git clone https://github.com/xshsaku/android_bitzenyminer.git
$ cd poolViewer
$ npm install
$ ionic serve #ブラウザで表示確認

```

## ionic info

```
cli packages: (/usr/local/lib/node_modules)

    @ionic/cli-utils  : 1.19.1
    ionic (Ionic CLI) : 3.19.1

global packages:

    cordova (Cordova CLI) : 8.0.0 
    Gulp CLI              : CLI version 3.9.1 Local version 3.9.1

local packages:

    Cordova Platforms : android 6.4.0 ios 4.5.4
    Ionic Framework   : ionic1 1.3.3

System:

    Android SDK Tools : 26.1.1
    ios-deploy        : 1.9.2 
    ios-sim           : 6.1.2 
    Node              : v8.9.4
    npm               : 5.6.0 
    OS                : macOS High Sierra
    Xcode             : Xcode 9.2 Build version  

Environment Variables:

    ANDROID_HOME : /Users/####/Library/Android/sdk

Misc:

    backend : pro

```

## Firebase組み込み

- iOSのみ対応

[Firebase](https://console.firebase.google.com/u/0/)

## 使用プラグイン

```
cordova-admob-sdk 0.13.1 "AdMob SDK"
cordova-plugin-admob-free 0.13.0 "Cordova AdMob Plugin"
cordova-plugin-device 1.1.4 "Device"
cordova-plugin-dialogs 2.0.1 "Notification"
cordova-plugin-firebase 0.1.25 "Google Firebase Plugin" #iOSのみ
cordova-plugin-inappbrowser 2.0.1 "InAppBrowser"
cordova-plugin-ionic-webview 1.1.16 "cordova-plugin-ionic-webview"
cordova-plugin-nativestorage 2.2.2 "NativeStorage"
cordova-plugin-splashscreen 4.0.3 "Splashscreen"
cordova-plugin-whitelist 1.3.1 "Whitelist"
cordova-promise-polyfill 0.0.2 "cordova-promise-polyfill"
cordova-sqlite-storage 2.2.0 "Cordova sqlite storage plugin"
cordova-support-google-services 1.0.0 "cordova-support-google-services"
ionic-plugin-keyboard 2.2.1 "Keyboard"
```

## ほかプラグインインストール注意点

```
$ ionic cordova platform add android
$ ionic cordova platform add ios
$ ionic cordova platform add browser
```

## Donation

Bitzeny: `ZxLhowvVVSGTwqj2orvnnxG2JuSD4yhdUP`
Bitcoin: `1K3RCJPU2tyzPDAq6yHnQL5PGdEghYbcrB`

