import { loginUserType, registerUserType } from '.';
import {
  loginUserValidation,
  registerUserValidation,
  validationError,
} from './validators';
import { hash } from 'bcryptjs';
import User from '../../../models/User';
import { IUser } from '../../../interfaces';
import { verify } from 'jsonwebtoken';
import { Request, Response } from 'express';
import { isAuth } from './isAuth';
import {
  createAccessToken,
  createRefreshToken,
  setRefreshTokenCookie,
} from '../../../security/jwt';

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
    const hashedPassword = await hash(password, parseInt(process.env.SALT_ROUNDS!));
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
    const accessToken = createAccessToken({ id: user.id });
    const refreshToken = createRefreshToken(
      { id: user.id },
      process.env.REFRESH_TOKEN_EXPIRE!
    );
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
    res.clearCookie('refreshToken');
    return { success: true, message: 'Logged out!' };
  }
  return { success: false, message };
};

interface IRefreshTokenResponse {
  success: boolean;
  message: string;
  userId: string | null;
  accessToken: string | null;
}

export const refreshToken = async (
  req: Request,
  res: Response
): Promise<IRefreshTokenResponse> => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) throw new Error('There is no token in the cookies');
    const tokenPayload = verify(token, process.env.REFRESH_TOKEN_SECRET!) as
      | { id: string }
      | undefined;
    const user: IUser = await User.findById({ _id: tokenPayload!.id });
    if (!user) throw new Error('There is no user with the id from the token');
    if (user.refreshToken !== token) {
      if (user.refreshToken) {
        await User.findByIdAndUpdate({ _id: user.id }, { $set: { refreshToken: '' } });
      }
      throw new Error('User does not have the same refresh token');
    }
    const accessToken = createAccessToken({ id: user.id });
    return {
      success: true,
      message: 'Sent new access token successfully',
      userId: user.id!,
      accessToken,
    };
  } catch (err: any) {
    res.clearCookie('refreshToken');
    return {
      success: false,
      message: err.message,
      userId: null,
      accessToken: null,
    };
  }
};
