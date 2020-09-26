package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	_ "github.com/lib/pq"
	"github.com/pkg/errors"
)

type sentence struct {
	ID    int    `json:"id"`
	Title string `json:"title"`
	Text  string `json:"text"`
	URL   string `json:"url"`
}

var db *sqlx.DB

func main() {
	log.SetFlags(log.Ldate | log.Ltime | log.LstdFlags | log.Lshortfile)

	log.Println("aaa")

	err := initDb()
	if err != nil {
		fmt.Printf("%+v", err)
		return
	}

	echo := echo.New()
	echo.Use(middleware.Logger())
	echo.Use(middleware.Recover())

	echo.GET("/sentences", getSentences)
	echo.DELETE("/sentences/:id", deleteSentence)
	echo.POST("/sentences", createSentence)

	echo.Logger.Fatal(echo.Start(":1323"))
}

func createSentence(c echo.Context) error {
	s := new(sentence)
	c.Bind(s)

	tx := db.MustBegin()
	tx.MustExec("INSERT INTO sentence (title, text, url) VALUES ($1, $2, $3)", s.Title, s.Text, s.URL)
	rows, _ := tx.Query("SELECT id FROM sentence ORDER BY id DESC LIMIT 1")
	for rows.Next() {
		rows.Scan(&s.ID)
	}
	tx.Commit()

	return c.JSON(http.StatusCreated, s)
}

func getSentences(c echo.Context) error {
	sentences := []sentence{}
	db.Select(&sentences, "SELECT id, title, text, url FROM sentence ORDER BY id ASC")
	return c.JSON(http.StatusOK, sentences)
}

func deleteSentence(c echo.Context) error {
	id := c.Param("id")
	tx := db.MustBegin()
	tx.MustExec("DELETE FROM sentence WHERE id=$1", id)
	tx.Commit()
	return c.NoContent(http.StatusNoContent)
}

// DB接続を初期化
func initDb() error {
	var err error
	db, err = sqlx.Connect("postgres", "dbname=mydb sslmode=disable")
	if err != nil {
		return errors.Wrap(err, "failed to init database connections")
	}
	return nil
}
