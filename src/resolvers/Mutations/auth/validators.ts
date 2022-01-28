import { registerUserType } from '.';
import User from '../../../models/User';
import { isValidEmail } from '../../../utils/regex';

type registerValidationType = {
  isValid: boolean;
  errors: validationError[];
};

type validationError = {
  message: string;
};

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
