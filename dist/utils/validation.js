"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentValidationSchema = exports.userValidationSchema = exports.postValidationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.postValidationSchema = joi_1.default.object({
    title: joi_1.default.string().min(1).max(100).required(),
    body: joi_1.default.string().min(1).max(500).required(),
    userId: joi_1.default.required(),
});
exports.userValidationSchema = joi_1.default.object({
    username: joi_1.default.string().required().trim().lowercase(),
    email: joi_1.default.string().email().required().trim().lowercase(),
    password: joi_1.default.string()
        .required()
        .trim()
        .min(6)
        .invalid("password", joi_1.default.ref("username")),
});
exports.commentValidationSchema = joi_1.default.object({
    postId: joi_1.default.required(),
    body: joi_1.default.string().min(1).max(500).required(),
    userId: joi_1.default.required(),
});
