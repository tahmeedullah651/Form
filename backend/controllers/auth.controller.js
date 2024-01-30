import Joi from "joi";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { ErrorMessage, SuccessMessage } from "../utils/ResponseMessage.js";
const signup = async (req, res) => {
  const { username, email, password } = req.body;
  const singupSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(4).max(20),
  });
  try {
    const { error } = singupSchema.validate(req.body);
    if (error) {
      return ErrorMessaage(res, 422, error.message);
    }
    const isEmailExist = await User.exists({ email });
    if (isEmailExist) {
      return ErrorMessage(res, 409, "Email already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const createUser = await User({
      username,
      email,
      password: hashedPassword,
    });
    const result = await createUser.save();
    if (!result) {
      return ErrorMessage(res);
    }
    return SuccessMessage(res, "User saved successfully", 201);
  } catch (error) {
    console.log(error);
    return ErrorMessage(res);
  }
};
const signin = async (req, res) => {
  const singinSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  const { error } = singinSchema.validate(req.body);
  if (error) {
    return ErrorMessage(res, 404, error.message);
  }
  try {
    const validUser = await User.findOne({ email: req.body.email });
    if (!validUser) {
      return ErrorMessage(res, 422, { message: "Invalid crediential" });
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      validUser.password
    );
    if (!validPassword) {
      return ErrorMessage(res, 422, { message: "Invalid crediential" });
    }
    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.ACCESS_TOKEN_SECRET
    );
    const { password: pass, ...rest } = validUser._doc;
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    return ErrorMessage(res);
  }
};

export { signup, signin };
