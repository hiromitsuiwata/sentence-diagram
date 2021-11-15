package main

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net"
	"net/http"
	"strings"
	"text/template"
)

type apiGateway struct {
	client_secret string
}

type introspectionResult struct {
	Active    bool   `json:"active"`
	Client_id string `json:"client_id"`
	Username  string `json:"username"`
	Iss       string `json:"iss"`
}

type backend struct {
	prefix      string
	backendUri  string
	callbackUri string
}

type Page struct {
}

// X-Forwarded-Forヘッダーを付与する
func (p *apiGateway) appendHostToXForwardHeader(remoteAddr string, header http.Header) {
	if clientIP, _, err := net.SplitHostPort(remoteAddr); err == nil {
		if prior, ok := header["X-Forwarded-For"]; ok {
			clientIP = strings.Join(prior, ", ") + ", " + clientIP
		}
		header.Set("X-Forwarded-For", clientIP)
	}
}

// HTTPヘッダーをコピーする
func (p *apiGateway) copyHeader(dst, src http.Header) {
	for k, vv := range src {
		for _, v := range vv {
			dst.Add(k, v)
		}
	}
}

func (p *apiGateway) createNewRequest(req *http.Request, removeSubpath string, backURL string) (*http.Request, error) {
	return http.NewRequest(req.Method, backURL+strings.Replace(req.URL.String(), removeSubpath, "/", 1), req.Body)
}

// アクセストークンがない場合、アクセストークンが無効な場合にfalseを返す。そうでない場合はtrueを返す
func (p *apiGateway) verifyToken(frontReq *http.Request) bool {
	// 認可サーバーへの送信用のHTTPクライアントを生成
	authClient := &http.Client{}

	// アクセストークンを取得
	accessToken := strings.Trim(strings.Replace(frontReq.Header.Get("Authorization"), "Bearer", "", 1), " ")
	if accessToken == "" {
		cookie, err := frontReq.Cookie("ACCESS_TOKEN")
		if err != nil {
			log.Println("🚫cookie error:", err)
			return false
		}
		// アクセストークンがない場合はfalseを返す
		if cookie.Value == "" {
			log.Println("🚫access_token(Authorization and Cookie) is empty")
			return false
		} else {
			accessToken = cookie.Value
		}
	}

	// アクセストークンが無効な場合も401応答
	introspectionResult := p.introspectAccessToken(p.client_secret, authClient, accessToken)
	// アクセストークンが無効な場合はfalseを返す
	return introspectionResult.Active
}

// Keycloakのイントロスペクションエンドポイントにアクセストークンを送信して検証する
// 検証結果はintrospectionResultで返し、Activeフィールドがtrueの場合は認可されている
func (p *apiGateway) introspectAccessToken(clientSecret string, client *http.Client, accessToken string) introspectionResult {
	url := "http://localhost:8080/auth/realms/sample_service/protocol/openid-connect/token/introspect"
	parameter := "token=" + accessToken + "&token_hint=access_token&client_id=sample_api_gateway&client_secret=" + clientSecret

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

func (p *apiGateway) responseDummyPage(frontWriter http.ResponseWriter) {
	// テスト用のダミーページ
	page := Page{}
	tmpl, err := template.ParseFiles("templete.html")
	if err != nil {
		log.Println("parse file error:", err)
	}
	err = tmpl.Execute(frontWriter, page)
	if err != nil {
		log.Println("execute template error:", err)
	}

	frontWriter.WriteHeader(http.StatusOK)
}

func (p *apiGateway) ServeHTTP(frontWriter http.ResponseWriter, frontReq *http.Request) {
	log.Println("➡️", frontReq.RemoteAddr, " ", frontReq.Method, " ", frontReq.URL)

	// バックエンドへの送信用のHTTPクライアントを生成
	backendClient := &http.Client{}

	// 定義
	var backReq *http.Request
	var err error

	// バックエンドへ送信するためのリクエストを生成
	var backendCandidates []backend
	backendCandidates = append(backendCandidates, backend{"/api/card/", "http://localhost:9080", "/api/card/callback"})
	backendCandidates = append(backendCandidates, backend{"/api/diagram/", "http://localhost:9081", "/api/diagram/callback"})
	backendCandidates = append(backendCandidates, backend{"/api/greeting/", "http://localhost:9083", "/api/greeting/callback"})

	for _, backendCandidate := range backendCandidates {
		if backReq == nil && strings.Contains(frontReq.URL.String(), backendCandidate.prefix) {
			// 認可コードが送信されてくるURL場合は、バックエンドへ通す
			if strings.HasPrefix(frontReq.URL.String(), backendCandidate.callbackUri) {
				//バックエンドへのリクエストを実行(greeting service)
				backReq, err = p.createNewRequest(frontReq, backendCandidate.prefix, backendCandidate.backendUri)
				if err != nil {
					log.Println("create new request error:", err)
				}
			} else {
				// アクセストークンの検証
				authorized := p.verifyToken(frontReq)
				if !authorized {
					p.responseUnauthorized(frontWriter)
					return
				}
				// 検証に成功した場合、バックエンドへのリクエストを実行(greeting service)
				backReq, err = p.createNewRequest(frontReq, backendCandidate.prefix, backendCandidate.backendUri)
				if err != nil {
					log.Println("create new request error:", err)
				}
			}
		}
	}
	if backReq == nil && frontReq.URL.String() == "/" {
		// 静的ファイル
		//backReq, err = http.NewRequest(frontReq.Method, "http://localhost:3000"+frontReq.URL.String(), frontReq.Body)

		// テスト用のダミーページ
		p.responseDummyPage(frontWriter)
		return
	}
	if backReq == nil {
		// /favicon.icoなどは404を返す
		frontWriter.WriteHeader(http.StatusNotFound)
		fmt.Fprint(frontWriter, "404 Not Found")
		return
	}

	// フロントエンド・リクエストのヘッダーをバックエンド・リクエストのヘッダーへコピー
	p.copyHeader(backReq.Header, frontReq.Header)

	// クライアントのIPアドレスをX-Forwarded-Forへ付与
	p.appendHostToXForwardHeader(frontReq.RemoteAddr, backReq.Header)

	// バックエンドへリクエストを送信
	backResp, err := backendClient.Do(backReq)
	if err != nil {
		http.Error(frontWriter, "Backend Request Error", http.StatusInternalServerError)
		log.Println("ServeHTTP:", err)
	} else {
		defer backResp.Body.Close()

		log.Println("⬅️", frontReq.RemoteAddr, " ", backReq.Method, " ", backReq.URL, " ", backResp.Status)

		// バックエンドのレスポンスをフロントエンドのレスポンスへ設定
		p.copyHeader(frontWriter.Header(), backResp.Header)
		frontWriter.WriteHeader(backResp.StatusCode)
		io.Copy(frontWriter, backResp.Body)
	}
}
