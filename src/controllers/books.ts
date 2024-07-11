import express from "express";
import {
  getBooks,
  getBookById,
  getBooksByAuthor,
  getBooksByTitle,
  getBooksByGenre,
  deleteBookById,
  // updateBookById
} from "../db/books";

export const getAllBooks = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const books = await getBooks();
    return res.status(200).json(books);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const getBookByIdController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const book = await getBookById(id);
    if (!book) {
      return res.sendStatus(404);
    }
    return res.status(200).json(book);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const getBooksByAuthorController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { author } = req.params;
    const books = await getBooksByAuthor(author);
    return res.status(200).json(books);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const getBooksByTitleController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { title } = req.params;
    const books = await getBooksByTitle(title);
    return res.status(200).json(books);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const getBooksByGenreController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { genre } = req.params;
    const books = await getBooksByGenre(genre);
    return res.status(200).json(books);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const deleteBookController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const deletedBook = await deleteBookById(id);
    if (!deletedBook) {
      return res.sendStatus(404);
    }
    return res.status(200).json(deletedBook);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const updateBookController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const { title, author, publishedDate, copiesAvailable, genre, summary } = req.body;

    const book = await getBookById(id);
    if (!book) {
      return res.sendStatus(404);
    }

    if (title) book.title = title;
    if (author) book.author = author;
    if (publishedDate) book.publishedDate = publishedDate;
    if (copiesAvailable) book.copiesAvailable = copiesAvailable;
    if (genre) book.genre = genre;
    if (summary) book.summary = summary;

    await book.save();
    return res.status(200).json(book);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
