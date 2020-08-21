#!/bin/bash

rm -f container/liberty/sentence-diagram-web.war
mvn -f server/pom.xml clean
