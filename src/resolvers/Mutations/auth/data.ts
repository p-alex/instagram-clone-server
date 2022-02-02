import { loginUserType, registerUserType } from '.';
import {
  loginUserValidation,
  registerUserValidation,
  validationError,
} from './validators';
import bcrypt from 'bcryptjs';
import User from '../../../models/User';
import { IUser } from '../../../interfaces';
import jwt, { sign, verify } from 'jsonwebtoken';
import { Request, Response } from 'express';
import { isAuth } from './isAuth';

interface IRegisterUserResponse {
  success: boolean;
  errors: validationError[];
  user: IUser | null;
}

export const registerUser = async ({
  fullName,
  email,
  username,
  password,
  confirmPassword,
}: registerUserType): Promise<IRegisterUserResponse> => {
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

interface ILoginUserResponse {
  success: boolean;
  errors: validationError[];
  userId: string | null;
  accessToken: string | null;
}

export const loginUser = async ({
  username,
  email,
  password,
  res,
}: loginUserType): Promise<ILoginUserResponse> => {
  const { isValid, errors, user } = await loginUserValidation({
    username,
    email,
    password,
  });
  if (isValid && user) {
    const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET!, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
    });
    const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET!, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
    });
    await User.findByIdAndUpdate({ _id: user.id }, { $set: { refreshToken } });
    setRefreshTokenCookie(res!, refreshToken);
    return { success: isValid, errors, userId: user.id!, accessToken };
  }
  return { success: isValid, errors, userId: null, accessToken: null };
};

interface ILogoutUser {
  success: boolean;
  message: string;
}

export const logoutUser = async (req: Request, res: Response): Promise<ILogoutUser> => {
  const { authenticated, userId, message } = await isAuth(req);
  if (authenticated) {
    await User.findByIdAndUpdate({ _id: userId }, { $set: { refreshToken: '' } });
    removeRefreshTokenCookie(res);
    return { success: true, message: 'Logged out!' };
  }
  return { success: false, message };
};

interface IRefreshToken {
  success: boolean;
  message: string;
  userId: string | null;
  accessToken: string | null;
}

export const refreshToken = async (
  req: Request,
  res: Response
): Promise<IRefreshToken> => {
  const token = req.cookies.refreshToken;
  if (!token)
    return {
      success: false,
      message: 'There is no token in the cookies',
      userId: null,
      accessToken: null,
    };
  let tokenPayload: { id: string } | undefined;
  try {
    tokenPayload = verify(token, process.env.REFRESH_TOKEN_SECRET!) as
      | { id: string }
      | undefined;
  } catch (err) {
    removeRefreshTokenCookie(res);
    return { success: false, message: 'Invalid token', userId: null, accessToken: null };
  }
  const user: IUser = await User.findById({ _id: tokenPayload!.id });
  if (!user)
    return {
      success: false,
      message: 'Cannot find user',
      userId: null,
      accessToken: null,
    };
  if (user.refreshToken !== token) {
    if (user.refreshToken) {
      await User.findByIdAndUpdate({ _id: user.id }, { $set: { refreshToken: '' } });
    }
    removeRefreshTokenCookie(res);
    return {
      success: false,
      message: 'User does not have the same refresh token',
      userId: null,
      accessToken: null,
    };
  }
  const accessToken = sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
  });
  return {
    success: true,
    message: 'Sent new access token successfully',
    userId: user.id!,
    accessToken,
  };
};

const setRefreshTokenCookie = (res: Response, refreshToken: string) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
};

const removeRefreshTokenCookie = (res: Response) => {
  res.cookie('refreshToken', '', {
    httpOnly: true,
    expires: new Date(0),
  });
};
