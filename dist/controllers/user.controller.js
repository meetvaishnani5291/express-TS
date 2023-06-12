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
const users_model_1 = __importDefault(require("../models/users.model"));
const posts_model_1 = __importDefault(require("../models/posts.model"));
const bcryptjs_1 = require("bcryptjs");
const joi_1 = require("joi");
const validation_1 = require("../utils/validation");
const joi_2 = __importDefault(require("joi"));
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const password = req.body.password;
        (0, joi_1.assert)(email, joi_2.default.string().email().required());
        (0, joi_1.assert)(password, joi_2.default.string().required());
        const user = yield users_model_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }
        const isMatch = yield (0, bcryptjs_1.compare)(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }
        const token = yield user.generateAuthToken();
        res.status(200).json({ token });
    }
    catch (err) {
        next(err);
    }
});
const addUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = req.body;
        (0, joi_1.assert)(Object.assign({}, newUser), validation_1.userValidationSchema);
        const userExist = yield users_model_1.default.findOne({ email: newUser.email });
        if (userExist)
            return res
                .status(400)
                .json({ message: "user with this email already exist" });
        const user = yield users_model_1.default.create(newUser);
        res.status(200).json(user);
    }
    catch (err) {
        next(err);
    }
});
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json(req.user);
});
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id;
        yield posts_model_1.default.deleteMany({ userId });
        yield users_model_1.default.deleteOne({ _id: userId });
        res.status(200).json({ success: true });
    }
    catch (err) {
        next(err);
    }
});
exports.default = {
    addUser,
    getUser,
    deleteUser,
    loginUser,
};
