import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  publishedDate: { type: Date, required: true },
  copiesAvailable: { type: Number, default: 1 },
  genre: { type: String },
  summary: { type: String },
  // owner: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
  // ownerUsername: { type: String },
  borrowedBy: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}]
});

export const BookModel = mongoose.model("Book", BookSchema);

export const getBooks = () => BookModel.find();

export const getBooksByTitle = (title: string) => BookModel.find({ title });

export const getBooksByAuthor = (author: string) => BookModel.find({ author });

export const getBookById = (id: string) => BookModel.findById(id);

export const getBooksByGenre = (genre: string) => BookModel.find({ genre });

export const createBook = (values: Record<string, any>) =>
  new BookModel(values).save().then((book) => book.toObject());

export const deleteBookById = (id: string) =>
  BookModel.findOneAndDelete({ _id: id });

export const updateBookById = (id: string, values: Record<string, any>) =>
  BookModel.findByIdAndUpdate(id, values, { new: true }).then((book) =>
    book.toObject()
  );
