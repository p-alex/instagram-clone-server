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
  errors: validationError[];
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
  const errors: validationError[] = [];

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
};

// ------------------------LOGIN VALIDATION------------------------
export const loginUserValidation = async ({
  username,
  email,
  password,
}: loginUserType): Promise<loginValidationType> => {
  const errors: validationError[] = [];
  if (!username && !email) {
    errors.push({ message: 'Please fill in all fields' });
    return { isValid: errors.length === 0, errors, user: null };
  }

  if (!password) {
    errors.push({ message: 'Please fill in all fields' });
    return { isValid: errors.length === 0, errors, user: null };
  }

  if (!username && email && password) {
    // if login with email
    const user = await User.findOne({ email });

    if (!user) {
      errors.push({ message: 'Invalid email or password' });
      return { isValid: errors.length === 0, errors, user: null };
    }

    const isValidPassword = await compare(password, user.password);

    if (!isValidPassword) {
      if (!errors.find((error) => error.message === 'Invalid email or password')) {
        errors.push({ message: 'Invalid email or password' });
      }
    }

    return { isValid: errors.length === 0, errors, user };
  }

  if (username && !email && password) {
    // if login with username
    const user = await User.findOne({ username });

    if (!user) {
      errors.push({ message: 'Invalid username or password' });
      return { isValid: errors.length === 0, errors, user: null };
    }

    const isValidPassword = await compare(password, user.password);

    if (!isValidPassword) {
      if (!errors.find((error) => error.message === 'Invalid username or password')) {
        errors.push({ message: 'Invalid username or password' });
      }
    }

    return { isValid: errors.length === 0, errors, user };
  }
  return { isValid: errors.length === 0, errors, user: null };
};
