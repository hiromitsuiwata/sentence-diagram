package main

// 参考
// https://www.section.io/engineering-education/build-a-rest-api-application-using-golang-and-postgresql-database/

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
	HOST        = "localhost"
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

type Movie struct {
	MovieID   string `json:"movieid"`
	MovieName string `json:"moviename"`
}

type JsonResponse struct {
	Type    string  `json:"type"`
	Data    []Movie `json:"data"`
	Message string  `json:"message"`
}

func main() {
	// ログ出力設定
	log.SetFlags(log.LstdFlags | log.Lshortfile)

	// DBの初期化
	InitDatabase()

	router := mux.NewRouter()

	// Route handles & endpoints
	router.HandleFunc("/movies/", GetMovies).Methods("GET")
	router.HandleFunc("/movies/", CreateMovie).Methods("POST")
	router.HandleFunc("/movies/{movieid}", DeleteMovie).Methods("DELETE")
	router.HandleFunc("/movies/", DeleteMovies).Methods("DELETE")

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
	_, err := db.Exec("CREATE TABLE IF NOT EXISTS movies (id SERIAL PRIMARY KEY, movieID VARCHAR(255), movieName VARCHAR(255))")
	checkErr(err)
	_, err = db.Exec("DELETE FROM movies")
	checkErr(err)
	_, err = db.Exec("INSERT INTO movies(movieID, movieName) VALUES($1, $2)", 1, "The Shawshank Redemption")
	checkErr(err)
	_, err = db.Exec("INSERT INTO movies(movieID, movieName) VALUES($1, $2)", 2, "The Godfather")
	checkErr(err)
	_, err = db.Exec("INSERT INTO movies(movieID, movieName) VALUES($1, $2)", 3, "The Godfather: Part II")
	checkErr(err)

	log.Println("Database has been initialized successfully!")
}

// Get all movies
func GetMovies(w http.ResponseWriter, r *http.Request) {
	db := setupDB()
	log.Println("Getting movies...")
	rows, err := db.Query("SELECT * FROM movies")
	checkErr(err)

	// var response []JsonResponse
	var movies []Movie

	// Foreach movie
	for rows.Next() {
		var id int
		var movieID string
		var movieName string
		err = rows.Scan(&id, &movieID, &movieName)
		checkErr(err)
		movies = append(movies, Movie{MovieID: movieID, MovieName: movieName})
	}

	var response = JsonResponse{Type: "success", Data: movies}
	json.NewEncoder(w).Encode(response)
}

// Create a movie
func CreateMovie(w http.ResponseWriter, r *http.Request) {
	movieID := r.FormValue("movieid")
	movieName := r.FormValue("moviename")
	var response = JsonResponse{}

	if movieID == "" || movieName == "" {
		response = JsonResponse{Type: "error", Message: "You are missing movieID or movieName parameter."}
	} else {
		db := setupDB()
		log.Println("Inserting movie into DB")
		log.Println("Inserting new movie with ID: ", movieID, " and name: ", movieName)

		var lastInsertID int
		err := db.QueryRow("INSERT INTO movies(movieID, movieName) VALUES($1, $2) returning id;", movieID, movieName).Scan(&lastInsertID)
		checkErr(err)

		response = JsonResponse{Type: "success", Message: "The movie has been inserted successfully!"}
	}

	json.NewEncoder(w).Encode(response)
}

// Delete a movie
func DeleteMovie(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	movieID := params["movieid"]
	var response = JsonResponse{}

	if movieID == "" {
		response = JsonResponse{Type: "error", Message: "You are missing movieID parameter."}
	} else {
		db := setupDB()
		log.Println("Deleting movie from DB")
		_, err := db.Exec("DELETE FROM movies where movieID = $1", movieID)
		checkErr(err)
		response = JsonResponse{Type: "success", Message: "The movie has been deleted successfully!"}
	}

	json.NewEncoder(w).Encode(response)
}

// Delete all movies
func DeleteMovies(w http.ResponseWriter, r *http.Request) {
	db := setupDB()
	log.Println("Deleting all movies...")
	_, err := db.Exec("DELETE FROM movies")
	checkErr(err)

	log.Println("All movies have been deleted successfully!")
	var response = JsonResponse{Type: "success", Message: "All movies have been deleted successfully!"}
	json.NewEncoder(w).Encode(response)
}
