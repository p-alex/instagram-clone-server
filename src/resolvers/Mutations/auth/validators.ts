import { compare } from 'bcryptjs';
import { loginUserType, registerUserType } from '.';
import { IUser } from '../../../interfaces';
import User from '../../../models/User';
import { isValidEmail } from '../../../utils/regex';

type registerValidationType = {
  isValid: boolean;
  errors: validationError[];
};

type loginValidationType = {
  isValid: boolean;
  message: string;
  user: IUser | null;
};

export type validationError = {
  message: string;
};

// ------------------------REGISTER VALIDATION------------------------
export const registerUserValidation = async ({
  fullName,
  email,
  username,
  password,
  confirmPassword,
}: registerUserType): Promise<registerValidationType> => {
  let errors: validationError[] = [];
  try {
    if (!fullName || !email || !username || !password || !confirmPassword) {
      errors.push({ message: 'Please fill in all fields' });
      return { isValid: errors.length === 0, errors };
    }
    if (!isValidEmail(email)) {
      errors.push({ message: 'Invalid email' });
      return { isValid: errors.length === 0, errors };
    }
    const user = await User.findOne({ email });
    if (user) {
      errors.push({ message: 'A user with that email already exists' });
      return { isValid: errors.length === 0, errors };
    }
    if (username.length < 6) {
      errors.push({ message: 'Username must be at least 6 characters long' });
    }
    if (password.length < 6) {
      errors.push({ message: 'Password must be at least 6 characters long' });
    }
    if (password !== confirmPassword) {
      errors.push({ message: 'Passwords must match' });
    }
    return { isValid: errors.length === 0, errors };
  } catch (err: any) {
    errors = [{ message: err.message }];
    return { isValid: false, errors };
  }
};

// ------------------------LOGIN VALIDATION------------------------
export const loginUserValidation = async ({
  username,
  password,
}: loginUserType): Promise<loginValidationType> => {
  try {
    if (!username || !password) throw new Error('Please fill in all fields');
    const user = await User.findOne({ username });
    if (!user) throw new Error('Invalid username or password');
    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword) throw new Error('Invalid username or password');
    return { isValid: true, message: 'Valid credentials', user };
  } catch (err: any) {
    return { isValid: false, message: err.message, user: null };
  }
};
