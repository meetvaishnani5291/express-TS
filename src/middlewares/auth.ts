import { verify } from "jsonwebtoken";
import User from "../models/users.model";
import { NextFunction, Response } from "express";
import { CustomRequest } from "../interfaces/CustomRequest.interface";

type token = {
  id: string;
};

const auth = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const token: string = req.header("authorization")!.replace("Bearer ", "");
    const decoded = verify(token, process.env.JWT_SECRET as string) as token;
    const user = await User.findOne(
      { _id: decoded.id },
      {
        password: 0,
        __v: 0,
      }
    );

    if (!user) return res.status(404).json({ message: "user not found" });
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({
      message: "Unauthorised",
    });
  }
};

export default auth;
