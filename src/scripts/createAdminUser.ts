import mongoose from "mongoose";
import { createUser, getUserByEmail } from "../db/users";
import { random, authentication } from "../helpers";
import dotenv from "dotenv";

dotenv.config();
// MongoDB connection string (make sure to replace with your actual connection string)
const mongoUri = process.env.MONGO_URL;

const createAdminUser = async () => {
  await mongoose.connect(mongoUri);

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const username = process.env.ADMIN_USERNAME;

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    console.log("Admin user already exists");
    process.exit(0);
    // return;
  }

  const salt = random();
  const user = await createUser({
    email,
    username,
    role: "admin",
    authentication: {
      salt,
      password: authentication(salt, password),
    },
  });

  console.log("Admin user created:", user);
  await mongoose.disconnect();
};

createAdminUser().catch((err) => {
  console.error(err);
  mongoose.disconnect();
});
