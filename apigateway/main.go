package main

import (
	"log"
	"flag"
	"net/http"
)

func main() {
	// ログ出力設定
	log.SetFlags(log.LstdFlags | log.Lshortfile)

	var addr = flag.String("addr", "127.0.0.1:2000", "The addr of the API Gateway")
	var client_secret = flag.String("client_secret", "dummy", "The client_secret of API Gateway")
	flag.Parse()

	handler := &apiGateway{client_secret: *client_secret}

	log.Println("starting API Gateway on", *addr)
	log.Println("client_id:", *client_secret)
	if err := http.ListenAndServe(*addr, handler); err != nil {
		log.Fatal("ListenAndServe:", err)
	}
}
