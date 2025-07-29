const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

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

////////////////////////////////////Now Using Promise and Async Await///////////////////////////////////////

// Helper: Simulate delay - used by axios mock server in this example
const simulateDelay = (data) =>
  new Promise((resolve) => setTimeout(() => resolve(data), 100));

// Task 10: Get all books using async callback function
public_users.get("/async-books", async (req, res) => {
  try {
    // Simulate async retrieval
    const getBooksAsync = () => simulateDelay(books);

    const data = await getBooksAsync();

    return res.status(200).json({
      status: true,
      message: "Books retrieved successfully using async/await",
      data,
    });
  } catch (err) {
    return res.status(500).json({ status: false, message: "Server error" });
  }
});

// Task 11: Search by ISBN using Promise and Axios
public_users.get("/promise/isbn/:isbn", (req, res) => {
  const { isbn } = req.params;

  const getBookByISBN = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (books[isbn]) resolve(books[isbn]);
      else reject("Book not found");
    }, 100);
  });

  getBookByISBN
    .then((book) =>
      res.status(200).json({
        status: true,
        message: "Book retrieved by ISBN successfully",
        data: book,
      })
    )
    .catch((error) => res.status(404).json({ status: false, message: error }));
});

// Task 12: Search by Author using Promise + Axios example
public_users.get("/promise/author/:author", (req, res) => {
  const author = req.params.author.toLowerCase();

  const searchByAuthor = new Promise((resolve, reject) => {
    setTimeout(() => {
      const results = Object.values(books).filter(
        (book) => book.author.toLowerCase() === author
      );
      results.length ? resolve(results) : reject("Author not found");
    }, 100);
  });

  searchByAuthor
    .then((booksByAuthor) =>
      res.status(200).json({
        status: true,
        message: "Books retrieved by author",
        data: booksByAuthor,
      })
    )
    .catch((error) => res.status(404).json({ status: false, message: error }));
});

// Task 13: Search by Title using Promise + Axios example
public_users.get("/promise/title/:title", (req, res) => {
  const title = req.params.title.toLowerCase();

  const searchByTitle = new Promise((resolve, reject) => {
    setTimeout(() => {
      const results = Object.values(books).filter(
        (book) => book.title.toLowerCase() === title
      );
      results.length ? resolve(results) : reject("Title not found");
    }, 100);
  });

  searchByTitle
    .then((booksByTitle) =>
      res.status(200).json({
        status: true,
        message: "Books retrieved by title",
        data: booksByTitle,
      })
    )
    .catch((error) => res.status(404).json({ status: false, message: error }));
});

module.exports.general = public_users;
