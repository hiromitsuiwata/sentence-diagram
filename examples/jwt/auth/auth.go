package auth

import (
	"net/http"
	"time"

	jwtmiddleware "github.com/auth0/go-jwt-middleware"
	jwt "github.com/dgrijalva/jwt-go"
)

// GetTokenHandler get token
var GetTokenHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	token := jwt.New(jwt.SigningMethodHS256)

	claims := token.Claims.(jwt.MapClaims)
	claims["admin"] = true
	claims["sub"] = "123456789"
	claims["name"] = "hiro"
	claims["iat"] = time.Now()
	claims["exp"] = time.Now().Add(time.Hour * 24).Unix()

	//tokenString, _ := token.SignedString([]byte(os.Getenv("SIGNINGKEY")))
	tokenString, _ := token.SignedString([]byte("my-secret-key"))

	w.Write([]byte(tokenString))

})

// JwtMiddleware check token
var JwtMiddleware = jwtmiddleware.New(jwtmiddleware.Options{
	ValidationKeyGetter: func(token *jwt.Token) (interface{}, error) {
		//return []byte(os.Getenv("SIGNINGKEY")), nil
		return []byte("my-secret-key"), nil
	},
	SigningMethod: jwt.SigningMethodHS256,
})
