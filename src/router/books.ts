import express from "express";
import {
  getAllBooks,
  getBookByIdController,
  getBooksByAuthorController,
  getBooksByTitleController,
  getBooksByGenreController,
  deleteBookController,
  updateBookController,
} from "../controllers/books";
import { isAuthenticated } from "../middlewares";

export default (router: express.Router) => {
  router.get("/books",isAuthenticated ,getAllBooks);
  router.get("/books/:id",isAuthenticated ,getBookByIdController);
  router.get("/books/author/:author",isAuthenticated ,getBooksByAuthorController);
  router.get("/books/title/:title",isAuthenticated ,getBooksByTitleController);
  router.get("/books/genre/:genre",isAuthenticated ,getBooksByGenreController);
  router.delete("/books/:id", isAuthenticated,deleteBookController);
  router.put("/books/:id", isAuthenticated,updateBookController);
};
