import { Request, Response } from 'express';
import { HydratedDocument } from 'mongoose';
import { IUser } from '../../../../interfaces';
import User from '../../../../models/User';
import { isAuth } from '../../../../security/isAuth';

interface ILogoutUser {
  statusCode: number;
  success: boolean;
  message: string;
}

export const logoutUser = async (req: Request, res: Response): Promise<ILogoutUser> => {
  const { isAuthorized, userId, message } = await isAuth(req);
  if (isAuthorized) {
    const refreshToken = req.cookies.refreshToken;
    const user: HydratedDocument<IUser> = await User.findById({ _id: userId });
    user.refreshToken = user.refreshToken?.filter((token) => token !== refreshToken);
    await user.save();
    res.cookie('refreshToken', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 0,
    });
    return { statusCode: 200, success: true, message: 'Logged out!' };
  }
  return { statusCode: 401, success: false, message };
};
