const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!isValid(username)) {
    return res.status(400).json({ message: "Already exists" });
  }

  if (!username || !password) {
    return res.status(400).json({ message: "Invalid username or password" });
  }

  users.push({ username, password });

  return res
    .status(200)
    .json({ message: "User successfully registered. Now you can login" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  const foundBook = books[isbn];

  if (!foundBook) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json(foundBook);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;

  const foundBook = Object.entries(books).find(
    ([_, value]) => value.author === author
  );

  if (!foundBook) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json(foundBook);
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;

  const foundBook = Object.entries(books).find(
    ([_, value]) => value.title === title
  );

  if (!foundBook) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json(foundBook);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  const foundBook = books[isbn];

  if (!foundBook) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json(foundBook.reviews);
});

module.exports.general = public_users;
