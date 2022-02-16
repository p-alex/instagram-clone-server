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
  statusCode: number;
  success: boolean;
  message: string;
  user: IUser | null;
}

export const registerUser = async ({
  fullname,
  email,
  username,
  password,
  confirmPassword,
}: registerUserType): Promise<IRegisterUserResponse> => {
  const { isValid, message } = await registerUserValidation({
    fullname,
    email,
    username,
    password,
    confirmPassword,
  });
  if (isValid) {
    const hashedPassword = await hash(password, parseInt(process.env.SALT_ROUNDS!));
    const newUser = new User({
      fullname,
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
    return { statusCode: 201, success: isValid, message, user: result };
  }
  return { statusCode: 400, success: isValid, message, user: null };
};

interface ILoginUserResponse {
  statusCode: number;
  success: boolean;
  message: string;
  userId: string | null;
  accessToken: string | null;
}

export const loginUser = async ({
  username,
  password,
  res,
}: loginUserType): Promise<ILoginUserResponse> => {
  const { isValid, message, user } = await loginUserValidation({
    username,
    password,
  });
  if (isValid && user) {
    const accessToken = createAccessToken({ id: user.id });
    const refreshToken = createRefreshToken({ id: user.id });
    await User.findByIdAndUpdate({ _id: user.id }, { $set: { refreshToken } });
    setRefreshTokenCookie(res!, refreshToken);
    return { statusCode: 200, success: isValid, message, userId: user.id!, accessToken };
  }
  return { statusCode: 401, success: isValid, message, userId: null, accessToken: null };
};

interface ILogoutUser {
  statusCode: number;
  success: boolean;
  message: string;
}

export const logoutUser = async (req: Request, res: Response): Promise<ILogoutUser> => {
  const { isAuthorized, userId, message } = await isAuth(req);
  if (isAuthorized) {
    await User.findByIdAndUpdate({ _id: userId }, { $set: { refreshToken: '' } });
    res.clearCookie('refreshToken');
    return { statusCode: 200, success: true, message: 'Logged out!' };
  }
  return { statusCode: 401, success: false, message };
};

interface IRefreshTokenResponse {
  statusCode: number;
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
    // Check for the refresh token in the cookies
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw new Error('There is no token in the cookies');
    // Verify refresh token
    const tokenPayload = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as
      | { id: string }
      | undefined;
    // Check if there is a user with the id coming from the refresh token
    const user: IUser = await User.findById({ _id: tokenPayload!.id });
    if (!user) throw new Error('There is no user with the id from the token');
    if (user.refreshToken !== refreshToken) {
      if (user.refreshToken) {
        await User.findByIdAndUpdate({ _id: user.id }, { $set: { refreshToken: '' } });
      }
      throw new Error('User does not have the same refresh token');
    }
    // Return new pair of access and refresh tokens
    const newAccessToken = createAccessToken({ id: user.id });
    const newRefreshToken = createRefreshToken({ id: user.id });
    // Add new refresh token to database
    await User.findByIdAndUpdate(
      { _id: user.id },
      { $set: { refreshToken: newRefreshToken } }
    );
    setRefreshTokenCookie(res, newRefreshToken);
    return {
      statusCode: 200,
      success: true,
      message: 'Sent new access token successfully',
      userId: user.id!,
      accessToken: newAccessToken,
    };
  } catch (err: any) {
    console.log(err.message);
    res.clearCookie('refreshToken');
    return {
      statusCode: 401,
      success: false,
      message: err.message,
      userId: null,
      accessToken: null,
    };
  }
};
