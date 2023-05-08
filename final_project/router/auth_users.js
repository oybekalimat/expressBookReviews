const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return !users.find((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  const user = users.find(
    (user) => user.username === username && user.password === password
  );

  return user;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Invalid username or password" });
  }

  const user = authenticatedUser(username, password);

  if (!user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  const accessToken = jwt.sign({ data: password }, "access", {
    expiresIn: 60 * 60,
  });

  req.session.authorization = {
    accessToken,
    username,
  };

  return res.status(200).json({ message: "User successfully logged in" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization.username;
  const isbn = req.params.isbn;
  const review = req.body.review;
  const foundBook = books[isbn];

  if (!foundBook) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!review) {
    return res.status(400).json({ message: "Invalid review" });
  }

  foundBook.reviews[username] = review;

  return res.status(200).json({ message: "Review added successfully" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization.username;
  const isbn = req.params.isbn;
  const foundBook = books[isbn];

  if (!foundBook) {
    return res.status(404).json({ message: "Book not found" });
  }

  foundBook.reviews[username] = undefined;

  return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
