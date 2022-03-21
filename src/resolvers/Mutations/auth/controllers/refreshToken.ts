import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { HydratedDocument } from 'mongoose';
import { IUser } from '../../../../interfaces';
import User from '../../../../models/User';
import {
  createAccessToken,
  createRefreshToken,
  setRefreshTokenCookie,
} from '../../../../security/jwt';

interface IRefreshTokenResponse {
  statusCode: number;
  success: boolean;
  message: string;
  userId: string | null;
  username: string | null;
  profileImg: string | null;
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
    const user: HydratedDocument<IUser> = await User.findById({ _id: tokenPayload!.id });
    if (user.refreshToken) {
      // Return new pair of access and refresh tokens
      const newAccessToken = createAccessToken({ id: user.id });
      const newRefreshToken = createRefreshToken({ id: user.id });
      // Add new refresh token to database
      const isTokenInArray = user.refreshToken.includes(refreshToken);
      if (!isTokenInArray) throw new Error('Invalid token');
      user.refreshToken = user.refreshToken.filter((token) => token !== refreshToken);
      user.refreshToken = [...user.refreshToken, newRefreshToken];
      await user.save();
      setRefreshTokenCookie(res, newRefreshToken);
      return {
        statusCode: 200,
        success: true,
        message: 'Sent new access token successfully',
        userId: user.id!,
        username: user.username,
        profileImg: user.profilePicture,
        accessToken: newAccessToken,
      };
    }
    throw new Error('There is no user with the id from the token');
  } catch (err: any) {
    console.log(err.message);
    res.cookie('refreshToken', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 0,
    });
    return {
      statusCode: 401,
      success: false,
      message: err.message,
      userId: null,
      username: null,
      profileImg: null,
      accessToken: null,
    };
  }
};
