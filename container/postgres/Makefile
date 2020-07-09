NAME := mydb
VERSION := 1.0

build:
		docker build -t $(NAME):$(VERSION) .

run:
		docker run -d -p 5432\:5432 --rm --name $(NAME) -e POSTGRES_PASSWORD=mypassword -e POSTGRES_USER=myuser -e POSTGRES_DB=mydb $(NAME)\:$(VERSION)

stop:
		docker stop $(NAME)

rmi:
		docker rmi $(NAME):$(VERSION)

attach:
		docker exec -it $(NAME) /bin/bash

logs:
		docker logs $(NAME)
