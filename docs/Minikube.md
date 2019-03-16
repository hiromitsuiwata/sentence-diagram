# Minikube を使った環境構築

## Minikube の前提  となるソフトウェアを導入

```bash
brew update
brew install docker hyperkit kubernetes-cli kubernetes-helm
```

## Minikube の導入

以下の URL から導入する.バージョンは適宜変更する
https://github.com/kubernetes/minikube/releases/tag/v0.35.0

ingress は有効化する

```bash
minikube addons enable ingress
```
