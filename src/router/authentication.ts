import express from "express";
import { validateLogin, validateRegister } from "../middlewares/validators";

import {
  // createBookController,
  // createResourceController,
  login,
  register,
} from "../controllers/authentication";

export default (router: express.Router) => {
  router.post("/auth/register", validateRegister,register);
  router.post("/auth/login", validateLogin,login);
  // router.post("/auth/createbook", createBookController);
  // router.post("/auth/createresource",createResourceController);
};
