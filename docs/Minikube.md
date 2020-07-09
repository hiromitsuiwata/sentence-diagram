# Minikube を使った環境構築

## Minikube の前提  となるソフトウェアを導入

```bash
brew update
brew install docker hyperkit kubernetes-cli kubernetes-helm
```

## Minikube の導入

```bash
# 起動
minikube start --driver=hyperkit
# ingress は有効化する
minikube addons enable ingress
# Helm更新
helm repo update
helm repo add bitnami https://charts.bitnami.com/bitnami
# Postgresql
helm install postgresql bitnami/postgresql
export POSTGRES_PASSWORD=$(kubectl get secret --namespace default postgresql -o jsonpath="{.data.postgresql-password}" | base64 --decode)
echo $POSTGRES_PASSWORD
# Redis
helm install redis bitnami/redis
export REDIS_PASSWORD=$(kubectl get secret --namespace default redis -o jsonpath="{.data.redis-password}" | base64 --decode)
echo $REDIS_PASSWORD
# Prometheus
helm install stable/prometheus
# Nginx
helm install nginx bitnami/nginx
# Liberty
helm repo add ibm-charts https://raw.githubusercontent.com/IBM/charts/master/repo/stable/
helm install liberty ibm-charts/ibm-open-liberty
```

## イメージ作成

```bash
docker pull openliberty/open-liberty:20.0.0.6-full-java8-openj9-ubi-amd64
```
