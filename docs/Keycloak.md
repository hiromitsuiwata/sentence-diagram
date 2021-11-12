# トークン発行

## Resource Owner Password Credentials Grant(Direct Access Grant)

- URLの`realms`の後は、作成したRealmのIDを指定する
- `client secret`は、`Clients`の`Credentials`タブで確認する
- `username`と`password`は`Users`で登録したものを使う

アプリが認可サーバーに送信するトークンリクエスト

OAuth 2.0(RF C6749)の4.1～4.4の認可グラントのバリエーション

- `response_type=code`は、Authorization Code Grant(RFC 6749 4.1)
- `response_type=token`は、Implicit Grant(RFC 6749 4.2)
- `grant_type=password`は、Resource Owner Password Credentials Grant(RFC 6749 4.3)
- `grant_type=client_credentials`は、Client Credentials Grant(RFC 6749 4.4)

```bash
curl http://localhost:8080/auth/realms/myrealm/protocol/openid-connect/token -d "grant_type=password&client_id=sample_application&client_secret=<client_secret>&username=sample_user&password=<password>&scope=openid"
```

1. アプリが認可サーバーにトークンを要求する
2. 一部のグラントでは、認可サーバーがユーザー認証を行う
2. アプリは入手したアクセストークンをリソースサーバーへ送信する
3. リソースサーバーはアプリから送信されたアクセストークンが有効か認可サーバーへ問い合わせる
4. 認可サーバーが有効と判断したら、リソースサーバーはアプリからのリクエストを許可する

access_token
{
  "exp": 1636722197,
  "iat": 1636721897,
  "jti": "e0adb878-55cb-4be7-b8af-bd86fb77dd7f",
  "iss": "http://localhost:8080/auth/realms/myrealm",
  "aud": "account",
  "sub": "645b1989-0489-48e9-befa-38d0cfe02fba",
  "typ": "Bearer",
  "azp": "sample_application",
  "session_state": "3c292c65-44f2-4ec7-ba66-4c4471e2b3a1",
  "acr": "1",
  "realm_access": {
    "roles": [
      "default-roles-myrealm",
      "offline_access",
      "uma_authorization"
    ]
  },
  "resource_access": {
    "account": {
      "roles": [
        "manage-account",
        "manage-account-links",
        "view-profile"
      ]
    }
  },
  "scope": "openid profile email",
  "sid": "3c292c65-44f2-4ec7-ba66-4c4471e2b3a1",
  "email_verified": false,
  "name": "John Doe",
  "preferred_username": "sample_user",
  "given_name": "John",
  "family_name": "Doe",
  "email": "sample@example.com"
}

id_token
{
  "exp": 1636722197,
  "iat": 1636721897,
  "auth_time": 0,
  "jti": "fce0c9ff-e86e-4fb9-958e-ffd8f5b36e27",
  "iss": "http://localhost:8080/auth/realms/myrealm",
  "aud": "sample_application",
  "sub": "645b1989-0489-48e9-befa-38d0cfe02fba",
  "typ": "ID",
  "azp": "sample_application",
  "session_state": "3c292c65-44f2-4ec7-ba66-4c4471e2b3a1",
  "at_hash": "1cx3STgL_o_t0VceB65BcA",
  "acr": "1",
  "sid": "3c292c65-44f2-4ec7-ba66-4c4471e2b3a1",
  "email_verified": false,
  "name": "John Doe",
  "preferred_username": "sample_user",
  "given_name": "John",
  "family_name": "Doe",
  "email": "sample@example.com"
}