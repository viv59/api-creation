import express from "express";
import { validateBookBorrowReturn, validateBookCreation, validateBookId, validateBookUpdate } from "../middlewares/bookValidators";
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
  router.post("/createbook", isAuthenticated, isAdmin, validateBookCreation,createBookController);
  router.get("/books", isAuthenticated, getAllBooks);
  router.get("/books/:id", isAuthenticated, validateBookId,getBookByIdController);
  router.get(
    "/books/author/:author",
    isAuthenticated,
    getBooksByAuthorController
  );
  router.get("/books/title/:title", isAuthenticated, getBooksByTitleController);
  router.get("/books/genre/:genre", isAuthenticated, getBooksByGenreController);
  router.delete("/books/:id", isAuthenticated, isAdmin, validateBookId,deleteBookController);
  router.patch("/books/:id", isAuthenticated, isAdmin, validateBookUpdate,updateBookController);
  router.post("/books/borrow/:bookId", isAuthenticated, validateBookBorrowReturn,borrowBook);
  router.post("/books/return/:bookId", isAuthenticated, validateBookBorrowReturn,returnBook);
};
