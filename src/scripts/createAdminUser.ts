import mongoose from "mongoose";
import { createUser, getUserByEmail } from "../db/users";
import { random, authentication } from "../helpers";
import dotenv from "dotenv";

dotenv.config();
// MongoDB connection string (make sure to replace with your actual connection string)
const mongoUri =
  process.env.MONGO_URL || "mongodb://localhost:27017/your-database-name";

const createAdminUser = async () => {
  await mongoose.connect(mongoUri);

  const email = "admin@example.com";
  const password = "password";
  const username = "admin";

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
