// 参考 https://gist.github.com/yowu/f7dc34bd4736a65ff28d

package main

import (
	"flag"
	"io"
	"log"
	"net"
	"net/http"
	"strings"
)

func appendHostToXForwardHeader(header http.Header, host string) {
	if prior, ok := header["X-Forwarded-For"]; ok {
		host = strings.Join(prior, ", ") + ", " + host
	}
	header.Set("X-Forwarded-For", host)
}

func copyHeader(dst, src http.Header) {
	for k, vv := range src {
		for _, v := range vv {
			dst.Add(k, v)
		}
	}
}

func createNewRequest(req *http.Request, removeSubpath string, backURL string) (*http.Request, error) {
	return http.NewRequest(req.Method, backURL+strings.Replace(req.URL.String(), removeSubpath, "/", 1), req.Body)
}

type proxyServer struct {
}

func (p *proxyServer) ServeHTTP(frontWriter http.ResponseWriter, frontReq *http.Request) {
	log.Println("FRONT: ", frontReq.RemoteAddr, " ", frontReq.Method, " ", frontReq.URL)

	// バックエンドへの送信用のHTTPクライアントを生成
	backendClient := &http.Client{}

	// バックエンドへ送信するためのリクエストを生成
	// TODO 必要に応じてここで分岐させ、トークンの検証、適切なサービスへの振り分けを行う
	var backReq *http.Request
	var err error
	if strings.Contains(frontReq.URL.String(), "/api/auth/") {
		// auth service
		backReq, err = createNewRequest(frontReq, "/api/auth/", "http://localhost:8000")
	} else if strings.Contains(frontReq.URL.String(), "/api/card/") {
		// TODO tokenの検証
		// card service
		backReq, err = createNewRequest(frontReq, "/api/card/", "http://localhost:9080")
	} else if strings.Contains(frontReq.URL.String(), "/api/diagram/") {
		// TODO tokenの検証
		// diagram service
		backReq, err = createNewRequest(frontReq, "/api/diagram/", "http://localhost:9081")
	} else {
		// 静的ファイル
		backReq, err = http.NewRequest(frontReq.Method, "http://localhost:3000"+frontReq.URL.String(), frontReq.Body)
	}

	if err != nil {
		log.Fatal("create backend request:", err)
	}

	// フロントエンド・リクエストのヘッダーをバックエンド・リクエストのヘッダーへコピー
	copyHeader(backReq.Header, frontReq.Header)

	// クライアントのIPアドレスをX-Forwarded-Forへ付与
	if clientIP, _, err := net.SplitHostPort(frontReq.RemoteAddr); err == nil {
		appendHostToXForwardHeader(backReq.Header, clientIP)
	}

	// バックエンドへリクエストを送信
	backResp, err := backendClient.Do(backReq)
	if err != nil {
		http.Error(frontWriter, "Backend Request Error", http.StatusInternalServerError)
		log.Fatal("ServeHTTP:", err)
	}
	defer backResp.Body.Close()

	log.Println(" BACK: ", frontReq.RemoteAddr, " ", backReq.Method, " ", backReq.URL, " ", backResp.Status)

	// バックエンドのレスポンスをフロントエンドのレスポンスへ設定
	copyHeader(frontWriter.Header(), backResp.Header)
	frontWriter.WriteHeader(backResp.StatusCode)
	io.Copy(frontWriter, backResp.Body)
}

func main() {
	var addr = flag.String("addr", "127.0.0.1:80", "The addr of the application.")
	flag.Parse()

	handler := &proxyServer{}

	log.Println("Starting proxy server on", *addr)
	if err := http.ListenAndServe(*addr, handler); err != nil {
		log.Fatal("ListenAndServe:", err)
	}
}
