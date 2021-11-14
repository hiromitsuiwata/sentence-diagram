# Keycloak

https://thinkit.co.jp/article/17621
https://qiita.com/TakahikoKawasaki/items/8567c80528da43c7e844
https://www.youtube.com/watch?v=PKPj_MmLq5E
https://www.appsdeveloperblog.com/keycloak-authorization-code-grant-example/

## 初期設定

1. admin/adminでログイン
2. Realmを追加。`sample_service`という名前で作成する。ここでRealmはKeycloakにおけるテナントを表す。
3. Clientを追加。ユーザー紐づいた権限を与えられるアプリのための設定。`sample_application`という名前で作成する。ここでClientはOAuth2などのClient（リソースオーナーの認可を得て, リソースオーナーの代理として保護されたリソースに対するリクエストを行うアプリケーション）を表す。`Access Type`は`confidential`、`Standard Flow Enabled`（OAuth2におけるAuthorization Code Grant）は`OFF`、`Direct Access Grants Enabled`（OAuth2におけるResource Owner Password Credentials Grant）は`ON`とする。
4. Client追加。API Gatewayのための設定。`sample_api_gateway`という名前で作成する。`Access Type`に`bearer-only`を指定する。API Gatewayはトークンのイントロスペクションだけ実行できる。`Credentials`タブで`Secret`を生成する。
5. ユーザーを追加。`sample_user`という名前で作成する。パスワードは`Credentials`で設定する。`Temporary`は`OFF`とする。


## トークン発行を試す。

OAuth 2.0(RF C6749)の4.1～4.4の認可グラントのバリエーション

- `response_type=code`は、Authorization Code Grant(RFC 6749 4.1)
- `response_type=token`は、Implicit Grant(RFC 6749 4.2)
- `grant_type=password`は、Resource Owner Password Credentials Grant(RFC 6749 4.3)
- `grant_type=client_credentials`は、Client Credentials Grant(RFC 6749 4.4)

### Resource Owner Password Credentials Grant(KeycloakではDirect Access Grant)

- URLの`realms`の後は、作成したRealmのIDを指定する
- `client secret`は、`Clients`の`Credentials`タブで確認する
- `username`と`password`は`Users`で登録したものを使う

クライアントが認可サーバーに送信するトークンリクエスト。access_token, refresh_token, id_tokenが返ってくるが、access_tokenだけ取り出したいなら`jq`を使う。アクセストークンを後で使うために保存する。

```bash
curl http://localhost:8080/auth/realms/sample_service/protocol/openid-connect/token -X POST -d "grant_type=password&client_id=sample_application&client_secret=<client_secret>&username=sample_user&password=<password>&scope=openid" | jq '.access_token'"
```

クライアントがAPI Gatewayに送信するリクエスト。上で取得したアクセストークンを`Authorization: Bearer`として送信する。

```bash
curl http://localhost:2000/api/greeting/hello -H "Authorization: Bearer <access_token>"
```


### Authorization Code Grant(KeycloakではStandard Flow)

#### 認可コードリクエスト

- Keycloakの管理画面で`sample_application`の`Standard Flow Enabled`をONに、`Direct AccessGrants Enabled`をOFFに設定する
- またValid Redirect URIsを設定する。なんでもよければ`*`を設定する。
- `response_type`, `client_id`、`redirect_uri`は設定する。
- `redirect_uri`は、認可コード(`code`)を受け取るURLを指定する(ブラウザ経由で認可サーバーから外部サービスに認可コードを送信する)
- stateはUUIDなどで推測されにくい文字列を生成して使う

例えば、greeting serviceに認可コードを届けるための認可コードリクエスト配下の通り。ユーザーに以下のURLを叩いてもらうと、Keycloakの認証画面が表示され、認証が成功すると`302 REDIRECT`応答が返ってきてgreeting serviceまで認可コードが送信される

http://localhost:8080/auth/realms/sample_service/protocol/openid-connect/auth?response_type=code&client_id=sample_application&scope=openid&state=dummy_state&redirect_uri=http://localhost:2000/api/greeting/callback


#### トークンリクエスト

ここで`code`は、認可コードリクエストの応答で得られるもの。sample_applicationがKeycloakにリクエストするとaccess_token, id_tokenなどが返ってくる。これをSet-Cookieに詰めれば、ブラウザのCookieにセットされる。

```bash
curl http://localhost:8080/auth/realms/sample_service/protocol/openid-connect/token -d "grant_type=authorization_code&client_id=sample_application&redirect_uri=http://localhost:2000/api/greeting/callback&client_secret=<client_secret>&code=<code>"
```

そのあとは、上記Resource Owner Password Credentials Grantとほぼ同じ。ブラウザがAPI Gatewayに送信するリクエストに上で取得したアクセストークンをCookieに載せて送信する。HttpOnlyをセットするとJavaScriptでAuthorizationヘッダーにセットできなくなるので、API GatewayではAuthorizationヘッダーではなく、Cookieからアクセストークンを読み出すのが良さそう。

curl http://localhost:2000/api/greeting/hello -b "ACCESS_TOKEN=<access_token>"