import { Request } from "express";
import { isAuth } from "../../../../security/isAuth";
import bcrypt from "bcryptjs";
import { isValidPassword } from "../../../../utils/register-validation";

export const changePassword = async (
  oldPassword: string,
  newPassword: string,
  req: Request
) => {
  const { isAuthorized, user, message } = await isAuth(req);
  if (!isAuthorized || !user)
    return { statusCode: 401, success: false, message };
  try {
    const isCorrectPassword = await bcrypt.compare(oldPassword, user.password);

    if (!isCorrectPassword)
      return { statusCode: 401, success: false, message: "Wrong password" };

    const isNewPasswordValid = isValidPassword(newPassword);

    if (!isNewPasswordValid)
      return { statusCode: 401, success: false, message: "Invalid password" };

    const newHashedPassword = await bcrypt.hash(
      newPassword,
      parseInt(process.env.SALT_ROUNDS!)
    );

    user.password = newHashedPassword;

    await user.save();

    return { statusCode: 200, success: true, message: "Password changed" };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      success: false,
      message: "Something went wrong...",
    };
  }
};
