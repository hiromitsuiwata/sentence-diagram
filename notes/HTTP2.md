# HTTP/2

## ALPNとJetty

HTTP/2を利用する場合、サーバーとクライアントの間のネゴシエーションが必要となる。TLSの拡張であるALPN(Application Layer Protocol Negotiation)という仕組みを使ってネゴシエーションを行う。Java実装によってALPNを有効化する方法が異なる。例えばOpenJDKを利用する場合は、JettyのALPNブートストラップライブラリを用いる。

OpenJDKのバージョンによって利用するべきALPNライブラリのバージョンが異なる。

- https://www.eclipse.org/jetty/documentation/9.4.x/alpn-chapter.html

例えば、OpenJDK 1.8.0u191、1.8.0u192を利用している場合は、ALPNブートストラップライブラリは8.1.13.v20181017を用いる。OracleJDKを用いる場合も同様である。Oracle Grizzlyのライブラリでも可能である。

- https://javaee.github.io/grizzly/http2.html

どちらの場合もJDKのバージョン毎に適切なライブラリを選択する必要がある。IBM JDKの場合は追加ライブラリは不要である。

- https://www.ibm.com/support/knowledgecenter/ja/SSEQTP_liberty/com.ibm.websphere.wlp.doc/ae/cwlp_alpnsupport.html

## 設定方法

OpenJDK上でWebSphere Libertyを用いる場合は、`jvm.properties`に以下のような記載を行う。

```
-Xbootclasspath/p:(path to alpn boot jar)/alpn-boot-(version).jar
```
