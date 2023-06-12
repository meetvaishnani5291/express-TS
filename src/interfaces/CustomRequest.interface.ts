import { IUser } from "../models/users.model";
import { Request } from "express";

export interface CustomQuery {
  pageno?: string;
  keyword?: string;
  itemsPerPage?: string;
}
export interface CustomRequest extends Request {
  user?: IUser;
}
