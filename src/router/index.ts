import express from "express";

import authentication from "./authentication";
import users from "./users";
import books from "./books";
import resources from "./resources";
import home from "./home";

const router = express.Router();

export default (): express.Router => {
  authentication(router);
  users(router);
  books(router);
  resources(router);
  home(router)
  return router;
};
