import Joi from "joi";

export const postValidationSchema = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  body: Joi.string().min(1).max(500).required(),
  userId: Joi.required(),
});

export const userValidationSchema = Joi.object({
  username: Joi.string().required().trim().lowercase(),
  email: Joi.string().email().required().trim().lowercase(),
  password: Joi.string()
    .required()
    .trim()
    .min(6)
    .invalid("password", Joi.ref("username")),
});

export const commentValidationSchema = Joi.object({
  postId: Joi.required(),
  body: Joi.string().min(1).max(500).required(),
  userId: Joi.required(),
});
