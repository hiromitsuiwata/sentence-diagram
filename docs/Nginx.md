# Nginx を使ってパフォーマンスを改善させる

```bash
docker pull nginx
docker run --name tmp-nginx-container  --rm --network="host" -d nginx
docker exec -it tmp-nginx-container bash
```

```bash
apt update
apt upgrade -y
apt install -y procps
apt install -y net-tools
apt install -y vim
apt install -y iputils-ping
```

`curl http://192.168.99.1:9080/sentence-diagram-web/#/`でホストへアクセスできる

# Mac に導入された Nginx を使って設定を作る

```bash
    server {
        listen       80;
        server_name  localhost;

        location / {
            proxy_pass http://localhost:9080/;
        }
```

```bash
# 起動
sudo nginx
# リロード
sudo nginx -s reload
# 停止
sudo nginx -s stop
```

/usr/local/etc/nginx/nginx.conf が macOS の場合の設定ファイル。config/nginx/nginx.conf にコピーを配置した。
