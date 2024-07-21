import express from "express";

import { deleteUserById, getUserById, getUsers } from "../db/users";

export const getAllUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const users = await getUsers();
    const filteredUsers = users.filter(user => user.role === 'user');

    return res.status(200).json(filteredUsers);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error fetching books");
  }
};

export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;

    const deleteUser = await deleteUserById(id);

    return res.json(deleteUser);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error deleting user");
  }
};

export const updateUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    if (!username) {
      return res.sendStatus(400);
    }

    const user = await getUserById(id);
    user.username = username;
    await user.save();

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error updating user credintials");
  }
};
