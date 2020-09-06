# SonarCube

## 目標

- Java, Go, TypeScript を利用するプロジェクトで SonarQube を利用して静的解析を行う

## 概要

- macOS 上に docker-machine, docker-compose で sonarcube のサーバーを立てる
- docker-machine の driver には VirtualBox を利用する
- テストカバレッジを SonarQube に与える設定は行わない
- SonarQube のサーバーを macOS 上に立てて、各プロジェクトに scanner を設定して実行する。scanner の設定方法が言語によって違う

## SonarQube サーバーを立てる

1. 開発元が作っている docker-compose.yml をコピーしておく。
   https://github.com/SonarSource/docker-sonarqube/blob/master/example-compose-files/sq-with-postgres/docker-compose.yml

2. 以下の手順で実行する

```bash
# docker-machine作成
docker-machine create default
# docker-machine起動
docker-machine start default
# sonarcubeが利用するElasticsearchを実行するためにパラメーターを変更
docker-machine ssh default "sudo sysctl -w vm.max_map_count=262144"
# 環境変数設定
eval $(docker-machine env default)
# IPアドレスを確認する
docker-machine ip
# sonarcube起動
docker-compose up -d
# ブラウザで開く(admin/admin でログイン可能)
open http://`(docker-machine ip)`:9000/
# 停止するときはCtrl+C
docker-compose rm
docker-machine stop
```

## Java の場合の実行方法

1. 事前に `~/.m2/settings.xml` に設定をしておく。`<sonar.host.url>`の部分は`docker-machine ip`の IP を指定する

```xml
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0
  https://maven.apache.org/xsd/settings-1.0.0.xsd">
  <localRepository/>
  <interactiveMode/>
  <offline/>
  <servers/>
  <mirrors/>
  <proxies/>
  <activeProfiles/>
  <pluginGroups>
    <pluginGroup>org.sonarsource.scanner.maven</pluginGroup>
  </pluginGroups>
  <profiles>
    <profile>
      <id>sonar</id>
      <activation>
        <activeByDefault>true</activeByDefault>
      </activation>
      <properties>
        <sonar.host.url>
        http://192.168.99.101:9000
        </sonar.host.url>
      </properties>
    </profile>
  </profiles>
</settings>
```

2. 実行する

```bash
mvn clean verify sonar:sonar -Dmaven.test.skip=true
```

## Go の場合の実行方法

1. sonar-scanner を導入する

```bash
brew install sonar-scanner
```

2. `sonar-project.properties` を作成する

```properties
sonar.projectKey=com.company.projectkey1
sonar.projectName=My Project Name

sonar.sources=.
sonar.exclusions=**/*_test.go,**/vendor/**
sonar.tests=.
sonar.test.inclusions=**/*_test.go
sonar.test.exclusions=**/vendor/**
```

3. 実行する

```bash
# sonar-scannerの導入
brew install sonar-scanner
# 実行する
sonar-scanner -Dsonar.host.url=http://192.168.99.100:9000
```

## TypeScript の場合

1. sonar-scanner を実行するためのパッケージを導入する

```bash
npm install -D sonarqube-scanner
```

2. sonar-scanner を実行するためのスクリプトを作成する. `sonar-project.js`という名前で作成する

```javascript
const sonarqubeScanner = require("sonarqube-scanner");
sonarqubeScanner(
  {
    serverUrl: "http://192.168.99.101:9000",
    options: {
      "sonar.sources": "./src",
    },
  },
  () => {}
);
```

3. package.json の`scripts`に以下を追加する

```javascript
"sonar": "node sonar-project.js"
```

4. 実行する

```bash
npm run sonar
```
