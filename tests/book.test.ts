import request from "supertest";
import express, { NextFunction } from "express";
import bodyParser from "body-parser";
import router from "../src/router";
import mongoose from "mongoose";
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use("/", router());

jest.mock("../src/middlewares", () => ({
  isAuthenticated: (
    req: express.Request,
    res: express.Response,
    next: NextFunction
  ) => next(),
  isAdmin: (req: express.Request, res: express.Response, next: NextFunction) =>
    next(),
  isOwner: (req: express.Request, res: express.Response, next: NextFunction) =>
    next(),
}));

// Helper function to log in and get the auth cookie
const loginAndGetAuthCookie = async () => {
  const response = await request(app).post("/auth/login").send({
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  });

  return response.headers["set-cookie"][0].split(";")[0];
};

describe("Books API", () => {
  let authCookie: string;
  let createdBook: any;

  beforeAll(async () => {
    await mongoose.connect(`${process.env.MONGO_URL}`);

    // Mock user login to get the authentication cookie
    authCookie = await loginAndGetAuthCookie();
  }, 30000); // Increased timeout to 30 seconds for MongoDB connection and login

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("GET /books", () => {
    it("should return all books", async () => {
      const response = await request(app)
        .get("/books")
        .set("Cookie", authCookie); // Set the auth cookie

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe("POST /createbook", () => {
    it("should create a new book", async () => {
      const newBook = {
        title: "Jane Eyre7",
        author: "Charlotte Brontë",
        publishedDate: "1847-10-16",
        copiesAvailable: 3,
        genre: "Romance",
        summary:
          "A novel that follows the experiences of its eponymous heroine, including her growth to adulthood and her love for Mr. Rochester.",
      };

      const response = await request(app)
        .post("/createbook")
        .set("Cookie", authCookie) // Set the auth cookie
        .send(newBook);

      expect(response.status).toEqual(201); // Adjusted to match correct status code for creation
      expect(response.body).toHaveProperty("_id");
      expect(response.body.title).toBe(newBook.title);

      createdBook = response.body;
    });

    it("should not create a book if required fields are missing", async () => {
      const incompleteBook = {
        author: "Test Author",
        publishedDate: "2024-01-01",
        copiesAvailable: 10,
        // genre: 'Test Genre',
      };

      const response = await request(app)
        .post("/createbook")
        .set("Cookie", authCookie) // Set the auth cookie
        .send(incompleteBook);

      expect(response.status).toBe(400); // Bad request due to missing required fields
    });

    it("should not create a duplicate book", async () => {
      const duplicateBook = {
        title: "Jane Eyre7",
        author: "Charlotte Brontë",
        publishedDate: "1847-10-16",
        copiesAvailable: 3,
        genre: "Romance",
        summary:
          "A novel that follows the experiences of its eponymous heroine, including her growth to adulthood and her love for Mr. Rochester.",
      };

      const response = await request(app)
        .post("/createbook")
        .set("Cookie", authCookie) // Set the auth cookie
        .send(duplicateBook);

      expect(response.status).toBe(400); // Duplicate book
    });
  });

  describe("GET /books/:id", () => {
    it("should return a book by id", async () => {
      const response = await request(app)
        .get(`/books/${createdBook._id}`)
        .set("Cookie", authCookie);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("_id");
      expect(response.body.title).toBe(createdBook.title);
    });
  });

  describe("GET /books/author/:author", () => {
    it("should return books by author", async () => {
      const response = await request(app)
        .get(`/books/author/${createdBook.author}`)
        .set("Cookie", authCookie);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe("GET /books/title/:title", () => {
    it("should return books by title", async () => {
      const response = await request(app)
        .get(`/books/title/${createdBook.title}`)
        .set("Cookie", authCookie);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe("GET /books/genre/:genre", () => {
    it("should return books by genre", async () => {
      const response = await request(app)
        .get(`/books/genre/${createdBook.genre}`)
        .set("Cookie", authCookie);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe("PATCH /books/:id", () => {
    it("should update a book by id", async () => {
      const updatedBook = {
        title: "Updated Book",
        author: "Updated Author",
      };

      const response = await request(app)
        .patch(`/books/${createdBook._id}`)
        .set("Cookie", authCookie)
        .send(updatedBook);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe(updatedBook.title);
    });
  });

  // describe("POST /books/borrow/:bookId", () => {
  //   it("should borrow a book", async () => {
  //     const response = await request(app)
  //       .post(`/books/borrow/${createdBook._id}`)
  //       .set("Cookie", authCookie);

  //     console.log("Borrow book response:", response.body);
  //     console.log("Borrow book status:", response.status);

  //     expect(response.status).toBe(200);
  //     expect(response.body.copiesAvailable).toBe(createdBook.copiesAvailable - 1); // Assuming 1 copy is borrowed
  //   });
  // });

  describe("DELETE /books/:id", () => {
    it("should delete a book by id", async () => {
      const response = await request(app)
        .delete(`/books/${createdBook._id}`)
        .set("Cookie", authCookie);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("_id", createdBook._id);
    });
  });
});
