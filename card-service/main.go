package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
)

const (
	HOST        = "db"
	PORT        = 5432
	DB_USER     = "myuser"
	DB_PASSWORD = "mypassword"
	DB_NAME     = "mydb"
)

// DB set up
func setupDB() *sql.DB {
	connectionString := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", HOST, PORT, DB_USER, DB_PASSWORD, DB_NAME)
	db, err := sql.Open("postgres", connectionString)
	checkErr(err)
	return db
}

type Sentence struct {
	ID    int    `json:"id"`
	Title string `json:"title"`
	Text  string `json:"text"`
	URL   string `json:"url"`
}

func main() {
	// ログ出力設定
	log.SetFlags(log.LstdFlags | log.Lshortfile)

	// DBの初期化
	InitDatabase()

	router := mux.NewRouter()

	// Route handles & endpoints
	router.HandleFunc("/sentences/", GetSentences).Methods("GET")
	router.HandleFunc("/sentences/", CreateSentence).Methods("POST")
	router.HandleFunc("/sentences/{id}", DeleteSentence).Methods("DELETE")
	router.HandleFunc("/sentences/search", SearchSentence).Methods("GET")

	// serve the app
	log.Println("Server at 9080")
	log.Fatal(http.ListenAndServe(":9080", router))
}

// Function for handling errors
func checkErr(err error) {
	if err != nil {
		panic(err)
	}
}

func InitDatabase() {
	log.Println("Initializing database...")
	db := setupDB()
	db.SetMaxOpenConns(10)
	db.SetMaxIdleConns(10)

	// Create table
	_, err := db.Exec("CREATE TABLE IF NOT EXISTS sentences (id SERIAL PRIMARY KEY, title character varying(1024), text character varying(1024) NOT NULL, url character varying(1024))")
	checkErr(err)
	_, err = db.Exec("DELETE FROM sentences")
	checkErr(err)
	_, err = db.Exec("INSERT INTO sentences(title, text, url) VALUES($1, $2, $3)", "title 1", "The white unicorn flew.", "http://example.com/")
	checkErr(err)
	_, err = db.Exec("INSERT INTO sentences(title, text, url) VALUES($1, $2, $3)", "Yukio Mishima", "Yukio Mishima (三島 由紀夫 Mishima Yukio) is the pen name of Kimitake Hiraoka (平岡 公威 Hiraoka Kimitake, January 14, 1925 – November 25, 1970), a Japanese author, poet, playwright, actor, model, film director, nationalist, and founder of the Tatenokai. Mishima is considered one of the most important Japanese authors of the 20th century.", "https://en.wikipedia.org/wiki/Yukio_Mishima")
	checkErr(err)

	log.Println("Database has been initialized successfully!")
}

// Get all sentences
func GetSentences(w http.ResponseWriter, r *http.Request) {
	db := setupDB()
	rows, err := db.Query("SELECT id, title, text, url FROM sentences")
	if err != nil {
		http.Error(w, "error", http.StatusBadRequest)
		return
	}

	var sentences []Sentence

	for rows.Next() {
		var id int
		var title string
		var text string
		var url string
		err = rows.Scan(&id, &title, &text, &url)
		if err != nil {
			http.Error(w, "error", http.StatusBadRequest)
			return
		}
		sentences = append(sentences, Sentence{ID: id, Title: title, Text: text, URL: url})

	}
	json.NewEncoder(w).Encode(sentences)
}

// Create a sentence
func CreateSentence(w http.ResponseWriter, r *http.Request) {
	var sentence = Sentence{}
	json.NewDecoder(r.Body).Decode(&sentence)

	title := sentence.Title
	text := sentence.Text
	url := sentence.URL

	if text == "" {
		http.Error(w, "insert error", http.StatusBadRequest)
		return
	} else {
		db := setupDB()
		var lastInsertID int
		err := db.QueryRow("INSERT INTO sentences (title, text, url) VALUES($1, $2, $3) returning id;", title, text, url).Scan(&lastInsertID)
		if err != nil {
			http.Error(w, "error", http.StatusBadRequest)
			return
		}
		sentence.ID = lastInsertID
		json.NewEncoder(w).Encode(sentence)
	}
}

func DeleteSentence(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id := params["id"]

	if id == "" {
		http.Error(w, "error", http.StatusBadRequest)
	} else {
		db := setupDB()
		var deletedID int
		err := db.QueryRow("DELETE FROM sentences WHERE id=$1 returning id;", id).Scan(&deletedID)
		if err != nil {
			http.Error(w, "error", http.StatusBadRequest)
			return
		}
		log.Println("Deleted ID: ", deletedID)
		w.WriteHeader(http.StatusOK)
	}
}

func SearchSentence(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()
	log.Println("keyword: ", query.Get("q"))

	db := setupDB()
	keyword := "%" + query.Get("q") + "%"
	rows, err := db.Query("SELECT id, title, text, url FROM sentences WHERE (lower(title) LIKE lower($1)) OR (lower(text) LIKE lower($1)) OR (lower(url) LIKE lower($1))", keyword)
	if err != nil {
		http.Error(w, "error", http.StatusBadRequest)
		return
	}

	var sentences []Sentence

	for rows.Next() {
		var id int
		var title string
		var text string
		var url string
		err = rows.Scan(&id, &title, &text, &url)
		if err != nil {
			http.Error(w, "error", http.StatusBadRequest)
			return
		}
		sentences = append(sentences, Sentence{ID: id, Title: title, Text: text, URL: url})

	}
	json.NewEncoder(w).Encode(sentences)
}
