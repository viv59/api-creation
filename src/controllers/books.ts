import express from "express";
import {
  getBooks,
  getBookById,
  getBooksByAuthor,
  getBooksByTitle,
  getBooksByGenre,
  deleteBookById,
  createBook,
  BookModel,
  getAllAuthors,
  getAllTitles,
  getAllGenres,
} from "../db/books";
import { get } from "lodash";
import { UserModel } from "../db/users";
import mongoose from "mongoose";
import { validationResult } from "express-validator";

export const getAllBooks = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const books = await getBooks();
    return res.status(200).json(books);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400).send("Error fetching books");
  }
};

export const getBookByIdController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const book = await getBookById(id);
    if (!book) {
      return res.sendStatus(404).send("Book not found");
    }
    return res.status(200).json(book);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400).send("Error fetching book by ID");
  }
};

export const getBooksByAuthorController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { author } = req.params;
    const books = await getBooksByAuthor(author);

    if (books.length === 0) {
      const availableAuthors = await getAllAuthors();
      return res.status(404).json({
        message: `Author not found. Available authors are: ${availableAuthors.join(
          ", "
        )}`,
      });
    }

    return res.status(200).json(books);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400).send("Error fetching books by author");
  }
};

export const getBooksByTitleController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { title } = req.params;
    const books = await getBooksByTitle(title);

    if (books.length === 0) {
      const availableTitles = await getAllTitles();
      return res.status(404).json({
        message: `Title not found. Available titles are: ${availableTitles.join(
          ", "
        )}`,
      });
    }

    return res.status(200).json(books);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400).send("Error fetching by title");
  }
};

export const getBooksByGenreController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { genre } = req.params;
    const books = await getBooksByGenre(genre);

    if (books.length === 0) {
      const availableGenres = await getAllGenres();
      return res.status(404).json({
        message: `Genre not found. Available genres are: ${availableGenres.join(
          ", "
        )}`,
      });
    }

    return res.status(200).json(books);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400).send("Erro fetching by genre");
  }
};

export const deleteBookController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const deletedBook = await deleteBookById(id);
    if (!deletedBook) {
      return res.sendStatus(404).send("Book not found");
    }
    return res.status(200).json(deletedBook);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error deleting book");
  }
};

export const updateBookController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, author, publishedDate, copiesAvailable, genre, summary } =
      req.body;

    const book = await getBookById(id);
    if (!book) {
      return res.status(404).send("Book not found");
    }

    if (title) book.title = title;
    if (author) book.author = author;
    if (publishedDate) book.publishedDate = new Date(publishedDate); // Ensure it's a Date object
    if (copiesAvailable !== undefined) book.copiesAvailable = copiesAvailable;
    if (genre) book.genre = genre;
    if (summary) book.summary = summary;

    const updatedBook = await book.save();

    return res.status(200).json(updatedBook);
  } catch (error) {
    console.error("Error updating book:", error);
    return res.status(500).send("Internal server error");
  }
};

export const createBookController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, author, publishedDate, copiesAvailable, genre, summary } =
      req.body;

    if (
      !title ||
      !author ||
      !publishedDate ||
      !copiesAvailable ||
      !genre
      // !summary
    ) {
      return res.sendStatus(400).send("Missing required book information");
    }

    const existingBooks = await getBooksByTitle(title);

    if (existingBooks.length > 0) {
      return res.sendStatus(400).json({ message: "Book already exists" });
    }

    const book = await createBook({
      title,
      author,
      publishedDate,
      copiesAvailable,
      genre,
      summary,
    });
    return res.status(201).json(book).end();
  } catch (error) {
    // console.log(error);
    // return res.sendStatus(400).send("Error creating book");
    return res.status(500);
  }
};

export const borrowBook = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = get(req, "identity._id") as string;
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const { bookId } = req.params;

    if (!userId || !bookId) {
      return res.status(400).send("Missing user ID or book ID");
    }

    // Check if the book is available
    const book = await BookModel.findById(bookId);
    if (!book) {
      return res.status(404).send("Book not found");
    }
    if (book.copiesAvailable <= 0) {
      return res.status(400).send("Book is not available for borrowing");
    }

    // Check if the user has already borrowed this book
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    if (user.borrowedBooks.includes(book._id)) {
      return res.status(400).send("User has already borrowed this book");
    }

    // Update the book's borrowed information
    book.borrowedBy.push(userObjectId);
    book.copiesAvailable -= 1;
    await book.save();

    // Update the user's borrowed books
    await UserModel.findByIdAndUpdate(userId, {
      $push: { borrowedBooks: book._id },
    });

    return res.status(200).json(book);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error");
  }
};

export const returnBook = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId: string = get(req, "identity._id") as string;
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const { bookId } = req.params;

    if (!userId || !bookId) {
      return res.status(400).send("Missing user ID or book ID");
    }

    // Check if the book is borrowed by the user
    const book = await BookModel.findById(bookId);
    if (!book) {
      return res.status(404).send("Book not found");
    }
    if (!book.borrowedBy.includes(userObjectId)) {
      return res.status(400).send("Book is not borrowed by this user");
    }

    // Update the book's borrowed information
    book.borrowedBy = book.borrowedBy.filter(
      (borrower) => !borrower.equals(userObjectId)
    );
    // book.borrowedDate.pop(); // Assuming the last borrow date corresponds to the returning user
    book.copiesAvailable += 1;
    await book.save();

    // Update the user's borrowed books
    await UserModel.findByIdAndUpdate(userId, {
      $pull: { borrowedBooks: book._id },
    });

    return res.status(200).json(book);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error");
  }
};
