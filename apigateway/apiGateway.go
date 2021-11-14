// 参考
// https://gist.github.com/yowu/f7dc34bd4736a65ff28d
// https://thinkit.co.jp/article/17621

package main

import (
	"encoding/json"
	"flag"
	"io"
	"io/ioutil"
	"log"
	"net"
	"net/http"
	"strings"
)

// X-Forwarded-Forヘッダーを付与する
func appendHostToXForwardHeader(header http.Header, host string) {
	if prior, ok := header["X-Forwarded-For"]; ok {
		host = strings.Join(prior, ", ") + ", " + host
	}
	header.Set("X-Forwarded-For", host)
}

// HTTPヘッダーをコピーする
func copyHeader(dst, src http.Header) {
	for k, vv := range src {
		for _, v := range vv {
			dst.Add(k, v)
		}
	}
}

type introspectionResult struct {
	Active    bool   `json:"active"`
	Client_id string `json:"client_id"`
	Username  string `json:"username"`
	Iss       string `json:"iss"`
}

func createNewRequest(req *http.Request, removeSubpath string, backURL string) (*http.Request, error) {
	return http.NewRequest(req.Method, backURL+strings.Replace(req.URL.String(), removeSubpath, "/", 1), req.Body)
}

type apiGateway struct {
	client_secret string
}

// アクセストークンがない場合、アクセストークンが無効な場合にfalseを返す。そうでない場合はtrueを返す
func (p *apiGateway) verifyToken(frontReq *http.Request) bool {
	// 認可サーバーへの送信用のHTTPクライアントを生成
	authClient := &http.Client{}

	// アクセストークンを取得
	access_token := strings.Trim(strings.Replace(frontReq.Header.Get("Authorization"), "Bearer", "", 1), " ")
	if access_token == "" {
		cookie, err := frontReq.Cookie("ACCESS_TOKEN")
		if err != nil {
			log.Println("🚫cookie error:", err)
		}
		// アクセストークンがない場合はfalseを返す
		if cookie.Value == "" {
			log.Println("🚫access_token(Authorization and Cookie) is empty")
			return false
		} else {
			access_token = cookie.Value
		}
	}

	// アクセストークンが無効な場合も401応答
	introspectionResult := introspectAccessToken(p.client_secret, authClient, access_token)
	// アクセストークンが無効な場合はfalseを返す
	return introspectionResult.Active
}

// Keycloakのイントロスペクションエンドポイントにアクセストークンを送信して検証する
// 検証結果はintrospectionResultで返し、Activeフィールドがtrueの場合は認可されている
func introspectAccessToken(client_secret string, client *http.Client, access_token string) introspectionResult {
	url := "http://localhost:8080/auth/realms/sample_service/protocol/openid-connect/token/introspect"
	parameter := "token=" + access_token + "&token_hint=access_token&client_id=sample_api_gateway&client_secret=" + client_secret

	body := strings.NewReader(parameter)
	req, err := http.NewRequest("POST", url, body)
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	if err != nil {
		log.Fatal("create request error:", err)
	}

	res, err := client.Do(req)
	if err != nil {
		log.Fatal("request error:", err)
	}
	defer res.Body.Close()

	resBody, err := ioutil.ReadAll(res.Body)
	if err != nil {
		log.Fatal("read body error:", err)
	}

	var result introspectionResult
	err = json.Unmarshal(resBody, &result)
	if err != nil {
		log.Println("json unmarshal error:", err)
	}
	log.Println("🔎introspectAccessToken active:", result.Active)
	log.Println("🔎introspectAccessToken username:", result.Username)
	log.Println("🔎introspectAccessToken client_id:", result.Client_id)
	if result.Active {
		log.Println("✅allowed to access")
	} else {
		log.Println("🚫denied to access")
	}
	return result
}

// HTTPレスポンスに401応答を書き込む
func (p *apiGateway) responseUnauthorized(frontWriter http.ResponseWriter) {
	frontWriter.WriteHeader(http.StatusUnauthorized)
	frontWriter.Write([]byte("401 Unauthorized"))
}

func (p *apiGateway) ServeHTTP(frontWriter http.ResponseWriter, frontReq *http.Request) {
	log.Println("➡️", frontReq.RemoteAddr, " ", frontReq.Method, " ", frontReq.URL)

	// バックエンドへの送信用のHTTPクライアントを生成
	backendClient := &http.Client{}

	// バックエンドへ送信するためのリクエストを生成
	var backReq *http.Request
	var err error
	if strings.Contains(frontReq.URL.String(), "/api/card/") {
		// アクセストークンの検証
		authorized := p.verifyToken(frontReq)
		if !authorized {
			p.responseUnauthorized(frontWriter)
			return
		}
		// 検証に成功した場合、バックエンドへのリクエストを実行(card service)
		backReq, err = createNewRequest(frontReq, "/api/card/", "http://localhost:9080")
	} else if strings.Contains(frontReq.URL.String(), "/api/diagram/") {
		// アクセストークンの検証
		authorized := p.verifyToken(frontReq)
		if !authorized {
			p.responseUnauthorized(frontWriter)
			return
		}
		// 検証に成功した場合、バックエンドへのリクエストを実行(diagram service)
		backReq, err = createNewRequest(frontReq, "/api/diagram/", "http://localhost:9081")
	} else if strings.Contains(frontReq.URL.String(), "/api/greeting/") {
		// 認可コードが送信されてくるURL場合は、バックエンドへ通す
		if strings.HasPrefix(frontReq.URL.String(), "/api/greeting/callback") {
			//バックエンドへのリクエストを実行(greeting service)
			backReq, err = createNewRequest(frontReq, "/api/greeting/", "http://localhost:9083")
		} else {
			// アクセストークンの検証
			authorized := p.verifyToken(frontReq)
			if !authorized {
				p.responseUnauthorized(frontWriter)
				return
			}
			// 検証に成功した場合、バックエンドへのリクエストを実行(greeting service)
			backReq, err = createNewRequest(frontReq, "/api/greeting/", "http://localhost:9083")
		}
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
		log.Println("ServeHTTP:", err)
	} else {
		defer backResp.Body.Close()

		log.Println("⬅️", frontReq.RemoteAddr, " ", backReq.Method, " ", backReq.URL, " ", backResp.Status)

		// バックエンドのレスポンスをフロントエンドのレスポンスへ設定
		copyHeader(frontWriter.Header(), backResp.Header)
		frontWriter.WriteHeader(backResp.StatusCode)
		io.Copy(frontWriter, backResp.Body)
	}
}

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
