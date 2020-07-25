AP_NAME := sentence-ap
DB_NAME := sentence-db
REDIS_NAME := sentence-redis
VERSION := 1.0

build:
		cd react-client; npm run build;
		cd server; mvn clean package -Dmaven.test.skip=true;
		cp server/sentence-diagram-web/target/sentence-diagram-web.war container/liberty/;
		cd container/liberty; docker build -t $(AP_NAME):$(VERSION) .;
		cd container/postgres; docker build -t $(DB_NAME):$(VERSION) .;
		cd container/redis; docker build -t $(REDIS_NAME):$(VERSION) .;

apply:
		kubectl apply -f container/deployment-db.yaml;
		kubectl apply -f container/deployment-redis.yaml;
		kubectl apply -f container/deployment-ap.yaml;

delete:
		kubectl delete -f container/deployment-ap.yaml;
		kubectl delete -f container/deployment-redis.yaml;
		kubectl delete -f container/deployment-db.yaml;

rmi:
		docker rmi $(AP_NAME):$(VERSION);
		docker rmi $(DB_NAME):$(VERSION);
		docker rmi $(REDIS_NAME):$(VERSION);
		# noneになったイメージは削除する
		docker image prune -f;
