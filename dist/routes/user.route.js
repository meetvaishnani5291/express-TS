"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const auth_1 = __importDefault(require("../middlewares/auth"));
router.post("/login", user_controller_1.default.loginUser);
router.get("/", auth_1.default, user_controller_1.default.getUser);
router.post("/", user_controller_1.default.addUser);
router.delete("/", auth_1.default, user_controller_1.default.deleteUser);
exports.default = router;
