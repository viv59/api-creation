import request from "supertest";
import express, { NextFunction } from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import router from "../src/router";
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

const loginAndGetAuthCookie = async () => {
  const response = await request(app).post("/auth/login").send({
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  });

  if (response.headers["set-cookie"]) {
    return response.headers["set-cookie"][0].split(";")[0];
  } else {
    throw new Error("Authentication cookie not found in response");
  }
};

describe("Users API", () => {
  let authCookie: string;
  let createdUser: any;

  beforeAll(async () => {
    await mongoose.connect(`${process.env.MONGO_URL}`);

    authCookie = await loginAndGetAuthCookie();
  }, 30000);

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("GET /users", () => {
    it("should return all users", async () => {
      const response = await request(app)
        .get("/users")
        .set("Cookie", authCookie);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe("POST /auth/register", () => {
    it("should create a new user", async () => {
      const newUser = {
        username: "Username",
        email: "new@email.com",
        password: "password",
      };

      const response = await request(app)
        .post("/auth/register")
        .set("Cookie", authCookie)
        .send(newUser);

      expect(response.status).toEqual(201); // Adjusted to match correct status code for creation
      expect(response.body).toHaveProperty("_id");
      createdUser = response.body;
      console.log("Created user:", createdUser); // Debug log
    });
  });

  describe("PATCH /users/:id", () => {
    it("should update a user by id", async () => {
      const updatedUser = {
        username: "New Username",
      };

      const response = await request(app)
        .patch(`/users/${createdUser._id}`)
        .set("Cookie", authCookie)
        .send(updatedUser);

      console.log("Update response status:", response.status); // Debug log for status
      console.log("Update response body:", response.body); // Debug log for body

      expect(response.status).toBe(200);
      expect(response.body.username).toBe(updatedUser.username);
    });
  });

  describe("DELETE /users/:id", () => {
    it("should delete user by id", async () => {
      const response = await request(app)
        .delete(`/users/${createdUser._id}`)
        .set("Cookie", authCookie);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("_id", createdUser._id);
    });
  });
});
