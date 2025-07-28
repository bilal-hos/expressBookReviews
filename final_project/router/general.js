const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    res.status(400).json({
      status: false,
      message: "username and password are required",
      data: [],
    });

  if (!isValid(username))
    res.status(400).json({
      status: false,
      message: "username already taken",
      data: [],
    });

  users.push({ username: username, password: password });
  res.status(201).json({
    status: true,
    message: "user cerated successfully",
    data: { username: username, password: password },
  });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  res
    .status(200)
    .json({ status: true, message: "retrieved successfully", data: books });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  let book = books[isbn];
  if (!book)
    res.status(404).json({
      status: false,
      message: "No book with this ID ",
      data: [],
    });

  res.status(200).json({
    status: true,
    message: "book details retrived successfully",
    data: book,
  });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;

  // Convert the books object to an array of book values
  const result = Object.values(books).filter((book) => book.author === author);

  if (!result.length > 1)
    res.status(404).json({
      status: false,
      message: "No books with this author found",
      data: [],
    });

  res.status(200).json({
    status: true,
    message: "books retrived successfully",
    data: result,
  });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;

  const result = Object.values(books).filter((book) => book.title === title);

  if (!result.length > 1)
    res.status(404).json({
      status: false,
      message: "No books with this author found",
      data: [],
    });

  res.status(200).json({
    status: true,
    message: "books retrived successfully",
    data: result,
  });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  book = books[isbn];

  if (!book)
    res.status(404).json({
      status: false,
      message: "no book in this isbn found",
      data: [],
    });

  reviews = book.reviews;

  res.status(200).json({
    status: true,
    message: "reviews retrived successfully",
    data: reviews,
  });
});

module.exports.general = public_users;
