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
exports.userSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const validator_1 = __importDefault(require("validator"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate: (value) => {
            if (!validator_1.default.isEmail(value))
                throw new Error("email is not valid!");
        },
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        validate: (value) => {
            if (value.toLowerCase().includes("password"))
                throw new Error("password can not contain word password!");
        },
    },
});
exports.userSchema.methods.generateAuthToken = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        const SECRET = process.env.JWT_SECRET ? process.env.JWT_SECRET : "secret";
        const token = jsonwebtoken_1.default.sign({ id: user._id }, SECRET, {
            expiresIn: "1d",
        });
        return token;
    });
};
exports.userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        if (user.isModified("password"))
            user.password = yield bcryptjs_1.default.hash(user.password, 10);
        next();
    });
});
exports.default = mongoose_1.default.model("User", exports.userSchema);
