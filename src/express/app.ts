import express, { json, urlencoded } from "express";
import morgan from "morgan";

require("dotenv").config();

import userRoutes from "../src/routes/user.route";
import postRoutes from "../src/routes/post.route";
import { ValidationError } from "joi";

const app = express();
app.use(morgan("dev"));

app.use(json());
app.use(urlencoded({ extended: false }));

//routes
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

app.use((error, req, res, next) => {
  if (error instanceof ValidationError) {
    return res.status(400).json({ message: error.details[0].message });
  }
  res.status(500).json({ message: error.message });
});

export default app;
