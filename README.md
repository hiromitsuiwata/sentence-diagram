# sentence-diagram

- [Stanford typed dependencies manual](https://nlp.stanford.edu/software/dependencies_manual.pdf)
- [Universal Dependencies](https://universaldependencies.org/u/dep/all.html)

## Jaeger

http://localhost:16686/

## 実行方法

```bash
# Postgresqlの起動
postgres -D /usr/local/var/postgres
# データベースの作成
createdb mydb
# Redisの起動
redis-server /usr/local/etc/redis.conf

# ビルド、テスト
cd react-client
npm run build
cd ../server
mvn clean package

# 実行
cd sentence-diagram-web
mvn liberty:run
```

## 依存関係の可視化

```bash
mvn depgraph:graph -DcreateImage=true -DimageFormat=svg -DshowClassifiers=true -DshowConflicts=true -DshowDuplicates=true -DshowGroupIds=true -DshowOptional=true -DshowVersions=true
```

## 実行準備(Minikube 上)

```bash
minikube start
eval $(minikube -p minikube docker-env)
make build
make apply
```
