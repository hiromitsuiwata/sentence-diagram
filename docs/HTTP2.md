# HTTP/2

## ALPN と Jetty

HTTP/2 を利用する場合、サーバーとクライアントの間のネゴシエーションが必要となる。TLS の拡張である ALPN(Application Layer Protocol Negotiation)という仕組みを使ってネゴシエーションを行う。Java 実装によって ALPN を有効化する方法が異なる。例えば OpenJDK を利用する場合は、Jetty の ALPN ブートストラップライブラリを用いる。

OpenJDK のバージョンによって利用するべき ALPN ライブラリのバージョンが異なる。

- https://www.eclipse.org/jetty/documentation/9.4.x/alpn-chapter.html

例えば、OpenJDK 1.8.0u191、1.8.0u192 を利用している場合は、ALPN ブートストラップライブラリは 8.1.13.v20181017 を用いる。OracleJDK を用いる場合も同様である。Oracle Grizzly のライブラリでも可能である。

- https://javaee.github.io/grizzly/http2.html

どちらの場合も JDK のバージョン毎に適切なライブラリを選択する必要がある。IBM JDK の場合は追加ライブラリは不要である。

- https://www.ibm.com/support/knowledgecenter/ja/SSEQTP_liberty/com.ibm.websphere.wlp.doc/ae/cwlp_alpnsupport.html

## 設定方法

OpenJDK 上で WebSphere Liberty を用いる場合は、`jvm.properties`に以下のような記載を行う。

```bash
-Xbootclasspath/p:(path to alpn boot jar)/alpn-boot-(version).jar
```
