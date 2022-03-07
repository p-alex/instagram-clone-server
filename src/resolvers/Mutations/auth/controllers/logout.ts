import { Request, Response } from 'express';
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
    await User.findByIdAndUpdate({ _id: userId }, { $set: { refreshToken: '' } });
    res.clearCookie('refreshToken');
    return { statusCode: 200, success: true, message: 'Logged out!' };
  }
  return { statusCode: 401, success: false, message };
};
