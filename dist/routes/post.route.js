"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const post_controller_1 = __importDefault(require("../controllers/post.controller"));
const auth_1 = __importDefault(require("../middlewares/auth"));
router.get("/", auth_1.default, post_controller_1.default.fetchAllPosts);
router.get("/search", auth_1.default, post_controller_1.default.searchPost);
router.get("/:id", auth_1.default, post_controller_1.default.fetchPostById);
router.post("/", auth_1.default, post_controller_1.default.addPost);
router.delete("/:id", auth_1.default, post_controller_1.default.deletePost);
router.post("/:id/comment", auth_1.default, post_controller_1.default.addCommentToPost);
exports.default = router;
