import { Request } from 'express';
import { verify } from 'jsonwebtoken';
import User from '../models/User';
import { ForbiddenError } from 'apollo-server-core';

export const isAuth = async (
  req: Request
): Promise<{ isAuthorized: boolean; userId?: string; message: string }> => {
  try {
    const isAuthorized = req.headers.authorization;
    if (!isAuthorized) throw new ForbiddenError('No Authorization header');
    const token = isAuthorized.split(' ')[1];
    if (!token) throw new ForbiddenError('No token in the authorization header');
    const tokenPayload = verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
      id: string;
    };
    if (!tokenPayload) throw new ForbiddenError('Invalid token');
    const user = await User.findById({ _id: tokenPayload.id });
    if (!user) throw new ForbiddenError("User with the id from the token doesn't exist");
    return { isAuthorized: true, userId: tokenPayload.id, message: 'Authenticated' };
  } catch (err: any) {
    return { isAuthorized: false, message: err.message };
  }
};
