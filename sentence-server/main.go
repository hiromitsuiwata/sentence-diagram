package main

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type (
	sentence struct {
		ID    int    `json:"id"`
		Title string `json:"title"`
		Text  string `json:"text"`
		URL   string `json:"url"`
	}
)

var (
	// DBの代わりにmapを使う
	sentences = map[int]*sentence{}
	seq       = 1
)

func main() {
	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.GET("/sentences", getSentences)
	e.DELETE("/sentences/:id", deleteSentence)
	e.POST("/sentences", createSentence)

	e.Logger.Fatal(e.Start(":1323"))
}

func createSentence(c echo.Context) error {
	s := &sentence{
		ID:    seq,
		Title: c.FormValue("title"),
		Text:  c.FormValue("text"),
		URL:   c.FormValue("url"),
	}
	if err := c.Bind(s); err != nil {
		return err
	}
	sentences[s.ID] = s
	seq++
	return c.JSON(http.StatusCreated, s)
}

func getSentences(c echo.Context) error {
	return c.JSON(http.StatusOK, sentences)
}

func deleteSentence(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	delete(sentences, id)
	return c.NoContent(http.StatusNoContent)
}
