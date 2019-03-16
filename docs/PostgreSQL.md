# PostgreSQL

## 導入

```bash
# psqlコマンドを利用
brew install postgres
```

## Minikbe 上で実行する

```bash
helm install --name postgres stable/postgresql
export PGPASSWORD=$(kubectl get secret --namespace default postgres-postgresql -o jsonpath="{.data.postgresql-password}" | base64 --decode)
kubectl port-forward --namespace default svc/postgres-postgresql 5432:5432 &
```

## Mac 上で実行する

```bash
mkdir /usr/local/var/postgres
initdb /usr/local/var/postgres -E utf8
postgres -D /usr/local/var/postgres
```

## シェルコマンド

```bash
# データベースを一覧表示
psql -l

# データベースを作成
createdb mydb

# データベース名を指定して接続
psql -d mydb

# ホスト名、ユーザー名を指定して接続する
psql --host 127.0.0.1 -U postgres
```

## psql コマンド

```bash
# データベースの作成
create database <dbname>
# データベースへの接続
\c <dbname>
# テーブル定義の表示
\d <tablename>
```

## JDBC ドライバー

https://jdbc.postgresql.org/download.html
