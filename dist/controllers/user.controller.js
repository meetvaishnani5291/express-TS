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
Object.defineProperty(exports, "__esModule", { value: true });
const users_model_1 = require("../models/users.model");
const posts_model_1 = require("../models/posts.model");
const bcryptjs_1 = require("bcryptjs");
const joi_1 = require("joi");
const validation_1 = require("../utils/validation");
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const password = req.body.password;
        (0, joi_1.assert)(email, (0, joi_1.string)().email().required());
        (0, joi_1.assert)(password, (0, joi_1.string)().required());
        const user = yield (0, users_model_1.findUser)({ email });
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
        const userExist = yield (0, users_model_1.findUser)({ email: newUser.email });
        console.log(userExist);
        if (userExist)
            return res
                .status(400)
                .json({ message: "user with this email already exist" });
        const user = yield (0, users_model_1.create)(newUser);
        res.status(200).json(user);
    }
    catch (err) {
        next(err);
    }
});
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json(req.user);
});
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id;
        yield (0, posts_model_1.deletePosts)({ userId });
        yield deleteUser({ _id: userId });
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
