import express from "express";
import {
  getAllBooks,
  getBookByIdController,
  getBooksByAuthorController,
  getBooksByTitleController,
  getBooksByGenreController,
  deleteBookController,
  updateBookController,
  createBookController,
  borrowBook,
  returnBook,
} from "../controllers/books";
import { isAdmin, isAuthenticated } from "../middlewares";
// import { createBookController } from "../controllers/authentication";

export default (router: express.Router) => {
  router.post("/createbook", isAuthenticated, isAdmin, createBookController);
  router.get("/books", isAuthenticated, getAllBooks);
  router.get("/books/:id", isAuthenticated, getBookByIdController);
  router.get(
    "/books/author/:author",
    isAuthenticated,
    getBooksByAuthorController
  );
  router.get("/books/title/:title", isAuthenticated, getBooksByTitleController);
  router.get("/books/genre/:genre", isAuthenticated, getBooksByGenreController);
  router.delete("/books/:id", isAuthenticated, isAdmin, deleteBookController);
  router.patch("/books/:id", isAuthenticated, isAdmin, updateBookController);
  router.post("/books/borrow/:bookId", isAuthenticated, borrowBook);
  router.post("/books/return/:bookId", isAuthenticated, returnBook);
};
