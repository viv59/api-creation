import express from "express";

import {
  createBookController,
  createResourceController,
  login,
  register,
} from "../controllers/authentication";

export default (router: express.Router) => {
  router.post("/auth/register", register);
  router.post("/auth/login", login);
  router.post("/auth/createbook", createBookController);
  router.post("/auth/createresource",createResourceController);
};
