import { loginUser, registerUser } from './data';

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
};

export default {
  registerUser: (
    _: undefined,
    { fullName, email, username, password, confirmPassword }: registerUserType
  ) => registerUser({ fullName, email, username, password, confirmPassword }),
  loginUser: (_: unknown, { username, email, password }: loginUserType) =>
    loginUser({ username, email, password }),
};
