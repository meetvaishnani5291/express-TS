import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";
import jwt from "jsonwebtoken";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
}
interface IUserMethods {
  generateAuthToken(): Promise<string>;
}
export const userSchema = new mongoose.Schema<IUser, {}, IUserMethods>({
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
    validate: (value: string) => {
      if (!validator.isEmail(value)) throw new Error("email is not valid!");
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
    validate: (value: string) => {
      if (value.toLowerCase().includes("password"))
        throw new Error("password can not contain word password!");
    },
  },
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const SECRET = process.env.JWT_SECRET ? process.env.JWT_SECRET : "secret";
  const token = jwt.sign({ id: user._id }, SECRET, {
    expiresIn: "1d",
  });
  return token;
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password"))
    user.password = await bcrypt.hash(user.password, 10);
  next();
});

export default mongoose.model("User", userSchema);
