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
import { Response } from 'express';

type registerUserResponse = {
  success: boolean;
  errors: validationError[];
  user: IUser | null;
};

type loginUserResponse = {
  success: boolean;
  errors: validationError[];
  accessToken: string | null;
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
      refreshToken: '',
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
  res,
}: loginUserType): Promise<loginUserResponse> => {
  const { isValid, errors, user } = await loginUserValidation({
    username,
    email,
    password,
  });

  if (isValid && user) {
    const accessToken = jwt.sign(
      { id: user.id, username: user.username },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: '10m' }
    );

    const refreshToken = jwt.sign(
      { id: user.id, username: user.username },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: '7d' }
    );

    res!.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      path: '/refresh_token',
    });

    try {
      await User.findByIdAndUpdate({ _id: user.id }, { $set: { refreshToken } });
    } catch (err: any) {
      errors.push({ message: err.message });
      return { success: isValid, errors, accessToken: null };
    }
    return { success: isValid, errors, accessToken };
  }
  return { success: isValid, errors, accessToken: null };
};

export const logoutUser = async ({ id, res }: { id: string; res: Response }) => {
  res.clearCookie('refreshToken', { path: '/refresh_token' });
  await User.findByIdAndUpdate({ _id: id }, { $set: { refreshToken: '' } });
  return { message: 'Logged out!' };
};
