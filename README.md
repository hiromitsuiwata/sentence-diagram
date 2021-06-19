# sentence-diagram

- [Stanford typed dependencies manual](https://nlp.stanford.edu/software/dependencies_manual.pdf)
- [Universal Dependencies](https://universaldependencies.org/u/dep/all.html)

## ビルド

```bash
cd react-client
npm run build
cd ../server
mvn clean package
```

## 依存関係の可視化

```bash
mvn depgraph:graph -DcreateImage=true -DimageFormat=svg -DshowClassifiers=true -DshowConflicts=true -DshowDuplicates=true -DshowGroupIds=true -DshowOptional=true -DshowVersions=true
```

## 実行準備(macOS 上)

```bash
# Postgresqlの起動
postgres -D /usr/local/var/postgres

# Redisの起動
redis-server /usr/local/etc/redis.conf
```

## 実行準備(Minikube 上)

```bash
minikube start
eval $(minikube -p minikube docker-env)
make build
make apply
```

## 実行方法(サーバーサイド開発中)

```bash
cd server
mvn clean package
cd sentence-diagram-web
mvn liberty:run
```
