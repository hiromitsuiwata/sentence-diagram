#!/bin/bash

HOST="http://localhost:9000"
TOKEN=$1

mvn clean verify sonar:sonar -f server/sentence-diagram-logic/pom.xml -Dsonar.projectKey=logic -Dsonar.host.url=${HOST} -Dsonar.login=${TOKEN}
mvn clean verify sonar:sonar -f server/sentence-diagram-web/pom.xml -Dsonar.projectKey=web -Dsonar.host.url=${HOST} -Dsonar.login=${TOKEN}
mvn clean verify sonar:sonar -f server/sentence-diagram-api/pom.xml -Dsonar.projectKey=api -Dsonar.host.url=${HOST} -Dsonar.login=${TOKEN}
