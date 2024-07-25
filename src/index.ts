import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";

import router from "./router";
require("dotenv").config();

const app = express();

app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000' // Allow requests from your React app
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`server running on http://localhost:${process.env.PORT}/`);
});

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on("error", (error: Error) => console.log(error));

app.use("/", router());
