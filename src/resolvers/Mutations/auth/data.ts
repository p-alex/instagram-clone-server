import { loginUserType, registerUserType } from '.';
import {
  loginUserValidation,
  registerUserValidation,
  validationError,
} from './validators';
import bcrypt from 'bcryptjs';
import User from '../../../models/User';
import { IUser } from '../../../interfaces';
import jwt from 'jsonwebtoken';

type registerUserResponse = {
  success: boolean;
  errors: validationError[];
  user: IUser | null;
};

type loginUserResponse = {
  success: boolean;
  errors: validationError[];
  token: string | null;
};

export const registerUser = async ({
  fullName,
  email,
  username,
  password,
  confirmPassword,
}: registerUserType): Promise<registerUserResponse> => {
  const { isValid, errors } = await registerUserValidation({
    fullName,
    email,
    username,
    password,
    confirmPassword,
  });

  if (isValid) {
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUNDS!)
    );

    const newUser = new User({
      fullName,
      email,
      username,
      password: hashedPassword,
      bio: '',
      profilePicture: '',
      posts: [],
      followers: [],
      following: [],
      gender: '',
    });

    const result: IUser = await newUser.save();

    return { success: isValid, errors, user: result };
  }

  return { success: isValid, errors, user: null };
};

export const loginUser = async ({
  username,
  email,
  password,
}: loginUserType): Promise<loginUserResponse> => {
  const { isValid, errors, user } = await loginUserValidation({
    username,
    email,
    password,
  });
  if (isValid && user) {
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET!
    );
    return { success: isValid, errors, token };
  }
  return { success: isValid, errors, token: null };
};
