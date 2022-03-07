import { Response, Request } from 'express';
import { loginUser } from './controllers/login';
import { logoutUser } from './controllers/logout';
import { refreshToken } from './controllers/refreshToken';
import { registerUser } from './controllers/register';

export type registerUserType = {
  email: string;
  fullname: string;
  username: string;
  password: string;
  confirmPassword: string;
};

export type loginUserType = {
  username: string;
  password: string;
  res?: Response;
};

export default {
  registerUser: (
    _: unknown,
    { email, fullname, username, password, confirmPassword }: registerUserType
  ) => registerUser({ email, fullname, username, password, confirmPassword }),
  loginUser: (
    _: unknown,
    { username, password }: loginUserType,
    { res }: { res: Response }
  ) => loginUser({ username, password, res }),
  logoutUser: (_: unknown, __: unknown, { req, res }: { req: Request; res: Response }) =>
    logoutUser(req, res),
  refreshToken: (
    _: unknown,
    __: unknown,
    { req, res }: { req: Request; res: Response }
  ) => refreshToken(req, res),
};
