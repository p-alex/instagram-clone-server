const EMAIL_REGEX =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
const USERNAME_REGEX = /^[a-zA-Z][a-zA-Z0-9_]{3,16}$/g;
const FULLNAME_REGEX = /^[a-zA-Z][a-zA-Z0-9 ]{1,35}$/g;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[-!@#$%^&*()_+|~=`{}\[\]:";'<>?,.\/]).{8,}$/g;

export const isValidEmail = async (email: string): Promise<boolean> => {
  const isValidEmail = await EMAIL_REGEX.test(email);
  return isValidEmail;
};

export const isValidFullname = async (fullname: string): Promise<boolean> => {
  const isValidFullName = await FULLNAME_REGEX.test(fullname);
  return isValidFullName;
};

export const isValidUsername = async (username: string): Promise<boolean> => {
  const isValidUsername = await USERNAME_REGEX.test(username);
  return isValidUsername;
};

export const isValidPassword = async (password: string): Promise<boolean> => {
  const isValidPassword = await PASSWORD_REGEX.test(password);
  return isValidPassword;
};
