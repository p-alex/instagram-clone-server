import { Response } from 'express';
import { loginUser, logoutUser, registerUser } from './data';

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
    _: undefined,
    { fullName, email, username, password, confirmPassword }: registerUserType
  ) => registerUser({ fullName, email, username, password, confirmPassword }),
  loginUser: (
    _: unknown,
    { username, email, password }: loginUserType,
    { res }: { res: Response }
  ) => loginUser({ username, email, password, res }),
  logoutUser: (_: unknown, { id }: { id: string }, { res }: { res: Response }) =>
    logoutUser({ id, res }),
};
