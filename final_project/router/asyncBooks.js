const express = require("express");
const axios = require("axios");
const books = require("./booksdb.js");
const asyncBooksRouter = express.Router();

// Helper: Simulate delay - used by axios mock server in this example
const simulateDelay = (data) =>
  new Promise((resolve) => setTimeout(() => resolve(data), 100));

// Task 10: Get all books using async callback function
asyncBooksRouter.get("/async-books", async (req, res) => {
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
asyncBooksRouter.get("/promise/isbn/:isbn", (req, res) => {
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
asyncBooksRouter.get("/promise/author/:author", (req, res) => {
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
asyncBooksRouter.get("/promise/title/:title", (req, res) => {
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

module.exports.asyncBooksRouter = asyncBooksRouter;
