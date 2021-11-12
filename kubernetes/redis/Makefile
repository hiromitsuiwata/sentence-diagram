NAME := myredis
VERSION := 1.0

build:
		docker build -t $(NAME):$(VERSION) .

run:
		docker run -d -p 6379\:6379 --rm --name $(NAME) $(NAME)\:$(VERSION)

stop:
		docker stop $(NAME)

rmi:
		docker rmi $(NAME):$(VERSION)

attach:
		docker exec -it $(NAME) /bin/bash

logs:
		docker logs $(NAME)
