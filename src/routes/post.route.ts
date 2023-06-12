import express from "express";
const router = express.Router();
import postController from "../controllers/post.controller";
import auth from "../middlewares/auth";

router.get("/", auth, postController.fetchAllPosts);

router.get("/search", auth, postController.searchPost);

router.get("/:id", auth, postController.fetchPostById);

router.post("/", auth, postController.addPost);

router.delete("/:id", auth, postController.deletePost);

router.post("/:id/comment", auth, postController.addCommentToPost);

export default router;
