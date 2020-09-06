package main

import (
	"log"
	"net/http"

	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	_ "github.com/lib/pq"
)

type sentence struct {
	ID    int    `json:"id"`
	Title string `json:"title"`
	Text  string `json:"text"`
	URL   string `json:"url"`
}

var db *sqlx.DB

func main() {
	initDb()

	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.GET("/sentences", getSentences)
	e.DELETE("/sentences/:id", deleteSentence)
	e.POST("/sentences", createSentence)

	e.Logger.Fatal(e.Start(":1323"))
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

func initDb() {
	var err error
	db, err = sqlx.Connect("postgres", "dbname=mydb sslmode=disable")
	if err != nil {
		log.Fatalln(err)
	}
}
