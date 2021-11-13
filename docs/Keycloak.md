# Keycloak

https://thinkit.co.jp/article/17621

## 初期設定

1. admin/adminでログイン
2. Realmを追加。`sample_service`という名前で作成する。ここでRealmはKeycloakにおけるテナントを表す。
3. Clientを追加。ユーザー紐づいた権限を与えられるアプリのための設定。`sample_application`という名前で作成する。ここでClientはOAuth2などのClient（リソースオーナーの認可を得て, リソースオーナーの代理として保護されたリソースに対するリクエストを行うアプリケーション）を表す。`Access Type`は`confidential`、`Standard Flow Enabled`（OAuth2におけるAuthorization Code Grant）は`OFF`、`Direct Access Grants Enabled`（OAuth2におけるResource Owner Password Credentials Grant）は`ON`とする。
4. Client追加。API Gatewayのための設定。`Access Type`に`bearer-only`を指定する。API Gatewayはトークンのイントロスペクションだけ実行できる。
5. ユーザーを追加。`sample_user`という名前で作成する。パスワードは`Credentials`で設定する。`Temporary`は`OFF`とする。


## トークン発行を試す。

OAuth 2.0(RF C6749)の4.1～4.4の認可グラントのバリエーション

- `response_type=code`は、Authorization Code Grant(RFC 6749 4.1)
- `response_type=token`は、Implicit Grant(RFC 6749 4.2)
- `grant_type=password`は、Resource Owner Password Credentials Grant(RFC 6749 4.3)
- `grant_type=client_credentials`は、Client Credentials Grant(RFC 6749 4.4)

### Resource Owner Password Credentials Grant(Direct Access Grant)

- URLの`realms`の後は、作成したRealmのIDを指定する
- `client secret`は、`Clients`の`Credentials`タブで確認する
- `username`と`password`は`Users`で登録したものを使う

クライアントが認可サーバーに送信するトークンリクエスト。access_token, refresh_token, id_tokenが返ってくるが、access_tokenだけ取り出したいなら`jq`を使う

```bash
curl http://localhost:8080/auth/realms/sample_service/protocol/openid-connect/token -d "grant_type=password&client_id=sample_application&client_secret=<client_secret>&username=sample_user&password=<password>&scope=openid | jq '.access_token'"
```

クライアントがAPI Gatewayに送信するリクエスト。上で取得したアクセストークンを`Authorization: Bearer`として送信する。

```bash
curl http://localhost:2000/api/greeting/hello -H "Authorization: Bearer <access_token>"
```