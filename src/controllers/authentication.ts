import express from "express";
import { createUser, getUserByEmail } from "../db/users";
import { random, authentication } from "../helpers";
import { validationResult } from "express-validator";
require("dotenv").config();

export const login = async (req: express.Request, res: express.Response) => {
  try {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );

    if (!user) {
      return res.status(400).send("Invalid email or password");
    }

    const expectedHash = authentication(user.authentication.salt, password);

    if (user.authentication.password !== expectedHash) {
      return res.status(403).send("Invalid email or password");
    }

    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );

    await user.save();

    res.cookie(process.env.SECRET_COOKIE, user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error");
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, username } = req.body;

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.status(400).send("Email already in use");
    }

    const salt = random();
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error");
  }
};
