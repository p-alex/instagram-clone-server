import { Response, Request } from "express";
import { changePassword } from "./controllers/changePassword";
import { confirmEmail } from "./controllers/confirmEmail";
import { loginUser } from "./controllers/login";
import { logoutUser } from "./controllers/logout";
import { refreshToken } from "./controllers/refreshToken";
import { registerUser } from "./controllers/register";
import { resetPassword } from "./controllers/resetPassword";
import { resetPasswordSendEmail } from "./controllers/resetPasswordSendEmail";
import { verifyResetPasswordToken } from "./controllers/verifyResetPasswordToken";

export type registerUserType = {
  email: string;
  fullname: string;
  username: string;
  password: string;
  confirmPassword: string;
  recaptchaToken: string;
};

export type loginUserType = {
  username: string;
  password: string;
  res?: Response;
};

export default {
  registerUser: (
    _: unknown,
    {
      email,
      fullname,
      username,
      password,
      confirmPassword,
      recaptchaToken,
    }: registerUserType
  ) =>
    registerUser({
      email,
      fullname,
      username,
      password,
      confirmPassword,
      recaptchaToken,
    }),
  confirmEmail: (
    _: unknown,
    { confirmationCode }: { confirmationCode: string }
  ) => confirmEmail(confirmationCode),
  resetPasswordSendEmail: (
    _: unknown,
    { email, recaptchaToken }: { email: string; recaptchaToken: string }
  ) => resetPasswordSendEmail(email, recaptchaToken),
  verifyResetPasswordToken: (_: unknown, { token }: { token: string }) =>
    verifyResetPasswordToken(token),
  resetPassword: (
    _: unknown,
    {
      token,
      newPassword,
      confirmNewPassword,
    }: { token: string; newPassword: string; confirmNewPassword: string }
  ) => resetPassword(token, newPassword, confirmNewPassword),
  loginUser: (
    _: unknown,
    { username, password }: loginUserType,
    { res }: { res: Response }
  ) => loginUser({ username, password, res }),
  logoutUser: (
    _: unknown,
    __: unknown,
    { req, res }: { req: Request; res: Response }
  ) => logoutUser(req, res),
  refreshToken: (
    _: unknown,
    __: unknown,
    { req, res }: { req: Request; res: Response }
  ) => refreshToken(req, res),
  changePassword: (
    _: unknown,
    { oldPassword, newPassword }: { oldPassword: string; newPassword: string },
    { req }: { req: Request }
  ) => changePassword(oldPassword, newPassword, req),
};
