import { registerUserType } from '.';
import { registerUserValidation } from './validators';
import bcrypt from 'bcryptjs';
import User from '../../../models/User';
import { IUser } from '../../../interfaces';

export const registerUser = async ({
  fullName,
  email,
  username,
  password,
  confirmPassword,
}: registerUserType) => {
  const { isValid, errors } = await registerUserValidation({
    fullName,
    email,
    username,
    password,
    confirmPassword,
  });

  if (isValid) {
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUNDS!)
    );

    const newUser = new User({
      fullName,
      email,
      username,
      password: hashedPassword,
      bio: '',
      profilePicture: '',
      posts: [],
      followers: [],
      following: [],
      gender: '',
    });

    const result: IUser = await newUser.save();

    return { success: isValid, errors, user: result };
  }

  return { success: isValid, errors, user: null };
};
