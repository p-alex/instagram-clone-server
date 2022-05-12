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

// ------------------------REGISTER VALIDATION------------------------
export const registerUserValidation = async ({
  fullname,
  email,
  username,
  password,
  confirmPassword,
}: registerUserType): Promise<registerValidationType> => {
  try {
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
    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword) throw new Error("Invalid username or password");
    return { isValid: true, message: "Valid credentials", user };
  } catch (err: any) {
    return { isValid: false, message: err.message, user: null };
  }
};
