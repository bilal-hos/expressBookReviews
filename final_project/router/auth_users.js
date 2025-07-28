const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const session = require("express-session");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  if (users.filter((user) => user.username === username).length > 0)
    return false;
  else return true;
};

const authenticatedUser = (username, password) => {
  const validatedUser = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validatedUser.length > 0) return true;
  else return false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({
      status: false,
      message: "username and password are requeired",
      data: [],
    });
  }

  if (!authenticatedUser(username, password)) {
    res.status(403).json({
      status: false,
      message: "Invalid creds",
      data: [],
    });
  }

  const accessToken = jwt.sign({ username }, "fingerprint_customer", {
    expiresIn: "1h",
  });

  req.session.authorization = {
    accessToken,
    username,
  };

  return res
    .status(200)
    .json({ message: "Login successful", accessToken: accessToken });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;

  const username = req.session.authorization?.username;

  // Check if user is authenticated
  if (!username) {
    return res.status(403).json({
      status: false,
      message: "No ",
      data: [],
    });
  }

  // Check if book exists
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({
      status: false,
      message: "Book not found",
      data: [],
    });
  }

  // Check if review is provided
  if (!review || review.trim().length === 0) {
    return res.status(400).json({
      status: false,
      message: "Review must have content",
      data: [],
    });
  }

  // Ensure the reviews object exists
  if (!book.reviews) {
    book.reviews = {};
  }

  // Add or update the review
  book.reviews[username] = review;

  return res.status(200).json({
    status: true,
    message: "Review added/updated successfully",
    reviews: book.reviews,
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization?.username;
  if (!username) {
    return res.status(403).json({
      status: false,
      message: "User not authenticated",
      data: [],
    });
  }
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({
      status: false,
      message: "Book not found",
      data: [],
    });
  }
  if (!book.reviews || !book.reviews[username]) {
    return res.status(404).json({
      status: false,
      message: "Review not found",
      data: [],
    });
  }
  delete book.reviews[username];
  return res.status(200).json({
    status: true,
    message: "Review deleted successfully",
    reviews: book.reviews,
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
