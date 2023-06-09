"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const mongoose = require("mongoose");
const chalk = require("chalk");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const app = require("./express/app");
const ENVIRONMENT = process.env.ENVIRONMENT;
const PORT = process.env.SERVER_PORT;
const HOST = process.env.SERVER_HOST;
const DATABASE_CONNECTION_STRING = `mongodb://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`;
function assertDatabaseConnectionOk() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(chalk.bgCyan.bold(`Checking database connection...`));
        try {
            mongoose.set("debug", true);
            yield mongoose.connect(DATABASE_CONNECTION_STRING);
            console.log(chalk.bgGreen.bold("Database connection OK!"));
        }
        catch (error) {
            console.log(chalk.bgRed("Unable to connect to the database:"));
            console.log(chalk.bgRed(error.message));
            process.exit(1);
        }
    });
}
function setupConfig() {
    return __awaiter(this, void 0, void 0, function* () {
        const swaggerOptions = {
            swaggerDefinition: require("./swagger/swagger.json"),
            apis: ["app.js"],
        };
        const swaggerSpec = swaggerJsdoc(swaggerOptions);
        app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    });
}
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        yield assertDatabaseConnectionOk();
        if (ENVIRONMENT === "devlopment")
            setupConfig();
        console.log(chalk.bgCyan.bold(`Starting Express server on port ${PORT}...`));
        app.listen(PORT, () => {
            console.log(chalk.bgGreen.bold(`Express server started on port ${PORT}`));
        });
    });
}
init();
