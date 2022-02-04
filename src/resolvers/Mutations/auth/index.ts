import { Response, Request } from 'express';
import { loginUser, logoutUser, refreshToken, registerUser } from './data';

export type registerUserType = {
  email: string;
  fullName: string;
  username: string;
  password: string;
  confirmPassword: string;
};

export type loginUserType = {
  username: string;
  email: string;
  password: string;
  res?: Response;
};

export default {
  registerUser: (
    _: unknown,
    { fullName, email, username, password, confirmPassword }: registerUserType
  ) => registerUser({ fullName, email, username, password, confirmPassword }),
  loginUser: (
    _: unknown,
    { username, email, password }: loginUserType,
    { res }: { res: Response }
  ) => loginUser({ username, email, password, res }),
  logoutUser: (_: unknown, __: unknown, { req, res }: { req: Request; res: Response }) =>
    logoutUser(req, res),
  refreshToken: (
    _: unknown,
    __: unknown,
    { req, res }: { req: Request; res: Response }
  ) => refreshToken(req, res),
};
