import { findUser, create, deleteUser } from "../models/users.model";
import { deletePosts } from "../models/posts.model";
import { compare } from "bcryptjs";
import { assert, string } from "joi";
import { userValidationSchema } from "../utils/validation";

const loginUser = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    assert(email, string().email().required());
    assert(password, string().required());

    const user = await findUser({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
    const isMatch = await compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const token = await user.generateAuthToken();
    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};

const addUser = async (req, res, next) => {
  try {
    const newUser = req.body;
    assert({ ...newUser }, userValidationSchema);

    const userExist = await findUser({ email: newUser.email });
    console.log(userExist);
    if (userExist)
      return res
        .status(400)
        .json({ message: "user with this email already exist" });

    const user = await create(newUser);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

const getUser = async (req, res, next) => {
  res.status(200).json(req.user);
};

const deleteUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    await deletePosts({ userId });
    await deleteUser({ _id: userId });
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};

export default {
  addUser,
  getUser,
  deleteUser,
  loginUser,
};
