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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const chalk_1 = __importDefault(require("chalk"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const app_1 = __importDefault(require("./express/app"));
const ENVIRONMENT = process.env.ENVIRONMENT || "devlopment";
const PORT = process.env.SERVER_PORT || 3002;
const HOST = process.env.SERVER_HOST || "localhost";
const DATABASE_HOST = process.env.DATABASE_HOST || "localhost";
const DATABASE_PORT = process.env.DATABASE_PORT || 27017;
const DATABASE_NAME = process.env.DATABASE_NAME || "UserPostDB2";
const DATABASE_CONNECTION_STRING = `mongodb://${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`;
function assertDatabaseConnectionOk() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(chalk_1.default.bgCyan.bold(`Checking database connection...`));
        try {
            mongoose_1.default.set("debug", true);
            yield mongoose_1.default.connect(DATABASE_CONNECTION_STRING);
            console.log(chalk_1.default.bgGreen.bold("Database connection OK!"));
        }
        catch (error) {
            console.log(chalk_1.default.bgRed("Unable to connect to the database:"));
            console.log(chalk_1.default.bgRed(error.message));
            process.exit(1);
        }
    });
}
function setupConfig() {
    return __awaiter(this, void 0, void 0, function* () {
        const swaggerOptions = {
            swaggerDefinition: require("../swagger/swagger.json"),
            apis: ["app.js"],
        };
        const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
        app_1.default.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
    });
}
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        yield assertDatabaseConnectionOk();
        if (ENVIRONMENT === "devlopment")
            setupConfig();
        console.log(chalk_1.default.bgCyan.bold(`Starting Express server on port ${PORT}...`));
        app_1.default.listen(PORT, () => {
            console.log(chalk_1.default.bgGreen.bold(`Express server started on port ${PORT}`));
        });
    });
}
init();
