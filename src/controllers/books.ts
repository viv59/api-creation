import express from "express";
import {
  getBooks,
  getBookById,
  getBooksByAuthor,
  getBooksByTitle,
  getBooksByGenre,
  deleteBookById,
  createBook,
  updateBookById,
  BookModel,
} from "../db/books";
import { get } from "lodash";
import { UserModel } from "../db/users";
import mongoose from "mongoose";

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
    const { title, author, publishedDate, copiesAvailable, genre, summary } =
      req.body;

    // const userId = get(req, "identity._id") as string;
    // const ownerUsername = get(req, "identity.username") as string;

    if (
      !title ||
      !author ||
      !publishedDate ||
      !copiesAvailable ||
      !genre ||
      !summary
    ) {
      return res.sendStatus(400);
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
      // owner: userId,
      // ownerUsername: ownerUsername,
    });

    // await UserModel.findByIdAndUpdate(userId, {
    //   $push: {
    //     ownedBooks: book._id,
    //     OwnedBooksNames: book.title,
    //   },
    // });

    return res.status(200).json(book).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const borrowBook = async (
  req: express.Request,
  res: express.Response
) => {
  try {
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
