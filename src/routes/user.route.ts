import express from "express";
const router = express.Router();
import userController from "../controllers/user.controller";
import auth from "../middlewares/auth";

router.post("/login", userController.loginUser);

router.get("/", auth, userController.getUser);

router.post("/", userController.addUser);

router.delete("/", auth, userController.deleteUser);

module.exports = router;
