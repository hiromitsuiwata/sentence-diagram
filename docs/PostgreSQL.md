# PostgreSQL

## 導入

```bash
brew install postgres # psqlコマンドを利用したいので導入

helm install --name postgres stable/postgresql
export PGPASSWORD=$(kubectl get secret --namespace default postgres-postgresql -o jsonpath="{.data.postgresql-password}" | base64 --decode)
kubectl port-forward --namespace default svc/postgres-postgresql 5432:5432 &
psql --host 127.0.0.1 -U postgres
```

## コマンド

```bash
# データベースを一覧表示
\l
# データベースの作成
create database <dbname>
# データベースへの接続
\c <dbname>
# テーブル定義の表示
\d <tablename>
```

## JDBCドライバー

https://jdbc.postgresql.org/download.html
