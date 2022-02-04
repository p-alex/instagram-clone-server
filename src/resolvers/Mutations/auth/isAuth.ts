import { Request } from 'express';
import { verify } from 'jsonwebtoken';
import User from '../../../models/User';

export const isAuth = async (
  req: Request
): Promise<{ authenticated: boolean; userId?: string; message: string }> => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) throw new Error('No Authorization header');
    const token = authorization.split(' ')[1];
    if (!token) throw new Error('No token in the authorization header');
    const tokenPayload = verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
      id: string;
    };
    if (!tokenPayload) throw new Error('Invalid token');
    const user = await User.findById({ _id: tokenPayload.id });
    if (!user) throw new Error("User with the id from the token doesn't exist");
    return { authenticated: true, userId: tokenPayload.id, message: 'Authenticated' };
  } catch (err: any) {
    return { authenticated: false, message: err.message };
  }
};
