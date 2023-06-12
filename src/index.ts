import mongoose from "mongoose";
import chalk from "chalk";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

import app from "./express/app";

const ENVIRONMENT = process.env.ENVIRONMENT || "devlopment";
const PORT = process.env.SERVER_PORT || 3002;
const HOST = process.env.SERVER_HOST || "localhost";
const DATABASE_HOST = process.env.DATABASE_HOST || "localhost";
const DATABASE_PORT = +process.env.DATABASE_PORT! || 27017;
const DATABASE_NAME = process.env.DATABASE_NAME || "UserPostDB2";
const DATABASE_CONNECTION_STRING = `mongodb://${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`;

async function assertDatabaseConnectionOk() {
  console.log(chalk.bgCyan.bold(`Checking database connection...`));
  try {
    mongoose.set("debug", true);
    await mongoose.connect(DATABASE_CONNECTION_STRING);
    console.log(chalk.bgGreen.bold("Database connection OK!"));
  } catch (error) {
    console.log(chalk.bgRed("Unable to connect to the database:"));
    console.log(chalk.bgRed((error as Error).message));
    process.exit(1);
  }
}
async function setupConfig() {
  const swaggerOptions = {
    swaggerDefinition: require("../swagger/swagger.json"),
    apis: ["app.js"],
  };

  const swaggerSpec = swaggerJsdoc(swaggerOptions);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

async function init() {
  await assertDatabaseConnectionOk();
  if (ENVIRONMENT === "devlopment") setupConfig();
  console.log(chalk.bgCyan.bold(`Starting Express server on port ${PORT}...`));
  app.listen(PORT, () => {
    console.log(chalk.bgGreen.bold(`Express server started on port ${PORT}`));
  });
}
init();
