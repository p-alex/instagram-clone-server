import { hash } from 'bcryptjs';
import { registerUserType } from '..';
import { IUser } from '../../../../interfaces';
import User from '../../../../models/User';
import { registerUserValidation } from '../validators';

interface IRegisterUserResponse {
  statusCode: number;
  success: boolean;
  message: string;
  user: IUser | null;
}

export const registerUser = async ({
  fullname,
  email,
  username,
  password,
  confirmPassword,
}: registerUserType): Promise<IRegisterUserResponse> => {
  const { isValid, message } = await registerUserValidation({
    fullname,
    email,
    username,
    password,
    confirmPassword,
  });
  if (isValid) {
    const hashedPassword = await hash(password, parseInt(process.env.SALT_ROUNDS!));
    const newUser = new User({
      fullname,
      email,
      username,
      password: hashedPassword,
    });
    const result: IUser = await newUser.save();
    return { statusCode: 201, success: isValid, message, user: result };
  }
  return { statusCode: 400, success: isValid, message, user: null };
};
