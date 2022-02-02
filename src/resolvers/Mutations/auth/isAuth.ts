import { Request } from 'express';
import { verify } from 'jsonwebtoken';
import User from '../../../models/User';

export const isAuth = async (
  req: Request
): Promise<{ authenticated: boolean; userId?: string; message: string }> => {
  const authorization = req.headers.authorization;
  if (!authorization) return { authenticated: false, message: 'No Authorization header' };
  const token = authorization.split(' ')[1];
  if (!token)
    return { authenticated: false, message: 'No token in the authorization header' };
  let tokenPayload;
  try {
    tokenPayload = verify(token, process.env.ACCESS_TOKEN_SECRET!) as
      | { id: string }
      | undefined;
  } catch (err: any) {
    return { authenticated: false, message: err.message };
  }
  if (!tokenPayload) return { authenticated: false, message: 'Invalid token' };
  const user = await User.findById({ _id: tokenPayload.id });
  if (!user)
    return {
      authenticated: false,
      message: "User with the id from the token doesn't exist",
    };
  return { authenticated: true, userId: tokenPayload.id, message: 'Authenticated' };
};
