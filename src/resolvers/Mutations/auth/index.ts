import { registerUser } from './data';

export type registerUserType = {
  email: string;
  fullName: string;
  username: string;
  password: string;
  confirmPassword: string;
};

export default {
  registerUser: (
    _: undefined,
    { fullName, email, username, password, confirmPassword }: registerUserType
  ) => registerUser({ fullName, email, username, password, confirmPassword }),
};
