import request from "supertest";
import express from "express";
import bodyParser from "body-parser";
import router from "../src/router";
import mongoose from "mongoose";
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use("/", router());

// Helper function to log in and get the auth cookie
const loginAndGetAuthCookie = async () => {
  const response = await request(app).post("/auth/login").send({
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  });

  return response.headers["set-cookie"][0].split(";")[0];
};

describe("Resources API", () => {
  let authCookie: string;
  let createdResourceId: string;

  beforeAll(async () => {
    await mongoose.connect(`${process.env.MONGO_URL}`);

    // Mock user login to get the authentication cookie
    authCookie = await loginAndGetAuthCookie();
  }, 30000); // Increased timeout to 30 seconds for MongoDB connection and login

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("Resources API Flow", () => {
    it("should return all resources initially", async () => {
      const response = await request(app)
        .get("/resources")
        .set("Cookie", authCookie);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });

    it("should create a new resource", async () => {
      const newResource = {
        name: "Resource Name",
        type: "newspaper",
        description: "Resource Description",
        availability: true,
        location: "Resource Location",
      };

      const response = await request(app)
        .post("/createresource")
        .set("Cookie", authCookie)
        .send(newResource);

      expect(response.status).toEqual(201);
      expect(response.body).toHaveProperty("_id");
      expect(response.body.name).toBe(newResource.name);

      createdResourceId = response.body._id;
    });

    it("should not create a duplicate resource", async () => {
      const newResource = {
        name: "Resource Name",
        type: "newspaper",
        description: "Resource Description",
        availability: true,
        location: "Resource Location",
      };

      const response = await request(app)
        .post("/createresource")
        .set("Cookie", authCookie)
        .send(newResource);

      expect(response.status).toBe(400);
    });

    it("should not create a resource if required fields are missing", async () => {
      const incompleteResource = {
        type: "newspaper",
        availability: true,
        location: "Resource Location",
      };

      const response = await request(app)
        .post("/createresource")
        .set("Cookie", authCookie)
        .send(incompleteResource);

      expect(response.status).toBe(400);
    });

    it("should return a resource by id", async () => {
      const response = await request(app)
        .get(`/resources/${createdResourceId}`)
        .set("Cookie", authCookie);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("_id");
      expect(response.body.name).toBe("Resource Name");
    });

    it("should return resources by name", async () => {
      const response = await request(app)
        .get("/resources/name/Resource Name")
        .set("Cookie", authCookie);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });

    it("should return resources by type", async () => {
      const response = await request(app)
        .get("/resources/type/newspaper")
        .set("Cookie", authCookie);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });

    it("should return resources by location", async () => {
      const response = await request(app)
        .get("/resources/location/Resource Location")
        .set("Cookie", authCookie);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });

    it("should update a resource by id", async () => {
      const updatedResource = {
        name: "Updated Resource Name",
        type: "magazine",
      };

      const response = await request(app)
        .patch(`/resources/${createdResourceId}`)
        .set("Cookie", authCookie)
        .send(updatedResource);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updatedResource.name);
    });

    // it("should borrow a resource", async () => {
    //   const response = await request(app)
    //     .post(`/resources/borrow/${createdResourceId}`)
    //     .set("Cookie", authCookie);

    //   expect(response.status).toBe(200);
    //   expect(response.body.availability).toBe(false);
    // });

    // it("should return a resource", async () => {
    //   const response = await request(app)
    //     .post(`/resources/return/${createdResourceId}`)
    //     .set("Cookie", authCookie);

    //   expect(response.status).toBe(200);
    //   expect(response.body.availability).toBe(true);
    // });

    it("should delete a resource by id", async () => {
      const response = await request(app)
        .delete(`/resources/${createdResourceId}`)
        .set("Cookie", authCookie);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("_id", createdResourceId);
    });
  });
});
