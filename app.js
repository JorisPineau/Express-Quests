require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());

const port = process.env.APP_PORT ?? 5000;

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};
app.get("/", welcome);

const movieHandlers = require("./movieHandlers");
const {validateMovie, validateUser} = require("./validators.js")
const { hashPassword, verifyPassword, verifyToken } = require("./auth.js");
const userHandlers = require("./userHandlers");

app.get("/api/movies",  movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);

app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUsersById);

app.post(
  "/api/login",
  userHandlers.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
);

app.post("/api/users", hashPassword, validateUser, userHandlers.postUser);

app.use(verifyToken);

app.post("/api/movies", verifyToken, validateMovie, movieHandlers.postMovie);
app.put('/api/movies/:id', verifyToken, validateMovie, movieHandlers.updateMovie)
app.delete('/api/movies/:id', verifyToken, movieHandlers.deleteMovie)

app.put("/api/users/:id", verifyToken, hashPassword, validateUser, userHandlers.updateUser);
app.delete("/api/users/:id", verifyToken, userHandlers.deleteUser)

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
