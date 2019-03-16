# WebSphere Liberty を使って HTTPS 通信を行う

## 調査

### Liberty がデフォルトで生成する鍵

Liberty を起動すると`user/servers/(server-name)/resources/security`に`key.jks`というファイルが生成される。
このファイルは Java Key Store という形式のファイルで中に秘密鍵、公開鍵が保存される。
JKS ファイルにはパスワードをかける必要がある。`server.xml`の`<keyStore>`要素でパスワードを指定する。

内容の確認方法は以下の通り(パスワードは`<keyStore>`で指定したもの)。default という別名(alias)で 1 セットの鍵が登録されている。

```bash
keytool -v -list -keystore key.jks
```

### Chrome で HTTPS 通信を行うためには

自己署名証明書を利用して HTTPS 通信を行いたい。過去は Common Name(CN)が設定されていれば OK だったが、Chrome 58 以降は証明書に Subject Alternative Name(SAN)が登録されていることを要求するため、SAN を含む証明書を作る必要がある。

### 用語の確認

- Certificate Signing Request(CSR)
  - 証明書署名要求。認証局に証明書を作ってもらうように依頼するためのフォーマット

### JKS に含まれている証明書には SAN が設定されていない

`key.jks`には自己署名証明書が内包されており取り出すことが可能。

```bash
keytool -exportcert -keystore key.jks -alias default -file default.der
```

ただし前述の SAN が登録されていないため、これだけではブラウザに安全な証明書として認めてもらえない。

```bash
openssl x509 -inform DER -outform PEM -in default.der -out default.pem
openssl x509 -text -in default.pem
```

## 手順

### SAN を含む証明書を作って JKS に登録する手順

```bash
# 秘密鍵作成
openssl genrsa 2048 > default.key
# CNはlocalhostにしておく
openssl req -new -key default.key > default.csr
# localhost用
echo subjectAltName=DNS:localhost > default-san.ext
# 証明書を作成する(sha256指定しないとsha1となる)
openssl x509 -days 3650 -sha256 -req -signkey default.key < default.csr > default.crt -extfile default-san.ext
# pkcs12形式の鍵ストアを作成する
openssl pkcs12 -export -in default.crt -inkey default.key -out default.p12 -name default
# PKCS12形式の鍵ストアを登録する
keytool -importkeystore -srckeystore default.p12 -destkeystore key.jks -srcstoretype pkcs12 -deststoretype jks -destalias default -alias default
```

### 作った証明書を Mac に登録する

キーチェーンアクセス.app を起動して、証明書を追加する。追加した証明書を右クリックして情報を見るから信頼を開いて、常に信頼するに設定を変更して保存する。

## 参考

- JDK keytool の基本的な使い方 (openssl との対比)
  - https://www.qoosky.io/techs/9db75cec15
  - http://thr3a.hatenablog.com/entry/20171203/1512229150
  - https://qiita.com/kunichiko/items/3c0b1a2915e9dacbd4c1
  - http://greathabits.simpleasure.net/?eid=1295889
  - https://qiita.com/irohamaru/items/cfbb5aa4ff0dae56e360
  - https://qiita.com/hnakamur/items/94a3a1d8862941a13d4f
