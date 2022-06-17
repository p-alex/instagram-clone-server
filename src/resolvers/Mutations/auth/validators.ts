import { compare } from "bcryptjs";
import { HydratedDocument } from "mongoose";
import { loginUserType, registerUserType } from ".";
import { IUser } from "../../../interfaces";
import User from "../../../models/User";
import {
  isValidEmail,
  isValidFullname,
  isValidPassword,
  isValidUsername,
} from "../../../utils/register-validation";
import axios from "axios";

type registerValidationType = {
  isValid: boolean;
  message: string;
};

type loginValidationType = {
  isValid: boolean;
  message: string;
  user: HydratedDocument<IUser> | null;
};

export type validationError = {
  message: string;
};

export const validateHuman = async (token: string): Promise<boolean> => {
  if (process.env.NODE_ENV === "development") return true;
  const secret = process.env.RECAPTCHA_SECRET_KEY!;
  const humanResponse = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`
  );
  const data = humanResponse.data;
  return data.success;
};

// ------------------------REGISTER VALIDATION------------------------
export const registerUserValidation = async ({
  fullname,
  email,
  username,
  password,
  confirmPassword,
  recaptchaToken,
}: registerUserType): Promise<registerValidationType> => {
  try {
    const isHuman = await validateHuman(recaptchaToken);
    if (!isHuman) throw new Error("Hello mr. bot");
    if (!fullname || !email || !username || !password || !confirmPassword)
      throw new Error("Please fill in all fields");
    if (!isValidEmail(email)) throw new Error("Invalid email");
    const user = await User.findOne({ email });
    if (user) throw new Error("A user with that email already exists");
    const isUniqueUsername = await User.findOne({ username });
    if (isUniqueUsername)
      throw new Error("A user with that username already exists");
    if (!isValidFullname(fullname)) throw new Error("Invalid fullname");
    if (!isValidUsername(username)) throw new Error("Invalid username");
    if (!isValidPassword(password)) throw new Error("Invalid password");
    if (password !== confirmPassword) throw new Error("Passwords must match");
    return { isValid: true, message: "Success!" };
  } catch (err: any) {
    return { isValid: false, message: err.message };
  }
};

// ------------------------LOGIN VALIDATION------------------------
export const loginUserValidation = async ({
  username,
  password,
}: loginUserType): Promise<loginValidationType> => {
  try {
    if (!username || !password) throw new Error("Please fill in all fields");
    const user: HydratedDocument<IUser> = await User.findOne({ username });
    if (!user) throw new Error("Invalid username or password");
    if (user.status === "Pending")
      throw new Error("Please check your inbox to confirm your email.");
    if (user.status === "Suspended") throw new Error("You are banned.");
    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword) throw new Error("Invalid username or password");
    return { isValid: true, message: "Valid credentials", user };
  } catch (err: any) {
    return { isValid: false, message: err.message, user: null };
  }
};
