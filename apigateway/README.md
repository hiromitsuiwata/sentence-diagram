# API Gateway

## 実行方法

実行時にKeycloakのclient_secretを与える

```bash
go run *.go -client_secret=<client_secret>
```

## API Gatewayが備えているべき機能

- バックエンドのサービスへのルーティング、URLの書き換え
- アクセストークンによって保護されているバックエンドサービスに対して、サービスの利用権限をチェックする
- 利用権限の有無は、アクセストークンをKeycloakなどの認可サーバーへ問い合わせることでチェックする(token introspection)
- ロギング
- アクセストークンのロールによってアクセス可能なAPIを絞り込む
- TODO token introspectionの結果をキャッシュし、毎回Keycloakへ問い合わせなくてもよいようにする
- TODO API Gatewayが性能上のボトルネックとなりそうなので、スケールアウトできるようにする(キャッシュは捨てるかRedisなどに保存)

## 参考

- https://gist.github.com/yowu/f7dc34bd4736a65ff28d
- https://thinkit.co.jp/article/17621
- https://www.youtube.com/watch?v=PKPj_MmLq5E
- https://events19.linuxfoundation.org/wp-content/uploads/2018/07/OpenSourceSummitJapan2019_YoshiyukiTabata.pdf
