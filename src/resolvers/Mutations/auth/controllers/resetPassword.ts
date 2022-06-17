import User from "../../../../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { isValidPassword } from "../../../../utils/register-validation";
import { HydratedDocument } from "mongoose";
import { IUser } from "../../../../interfaces";

export const resetPassword = async (
  token: string,
  newPassword: string,
  confirmNewPassword: string
) => {
  try {
    if (!newPassword || !confirmNewPassword)
      return {
        statusCode: 400,
        success: false,
        message: "Please fill in all fields",
      };

    if (!isValidPassword(newPassword))
      return {
        statusCode: 400,
        success: false,
        message: "Invalid password",
      };

    if (newPassword !== confirmNewPassword)
      return {
        statusCode: 400,
        success: false,
        message: "Passwords must match",
      };

    const tokenPayload = jwt.verify(
      token,
      process.env.RESET_PASSWORD_TOKEN_SECRET!
    ) as {
      email: string;
    };

    if (!tokenPayload) throw new Error();

    const user: HydratedDocument<IUser> = await User.findOne({
      email: tokenPayload.email,
    });

    if (!user || user.status !== "Active") {
      return {
        statusCode: 404,
        success: false,
        message: "A user with that id doesn't exist",
      };
    }

    const newHashedPassword = await bcrypt.hash(
      newPassword,
      parseInt(process.env.SALT_ROUNDS!)
    );

    user.confirmationCode = "";
    user.password = newHashedPassword;

    await user.save();

    return {
      statusCode: 200,
      success: true,
      message: "Password has been changed",
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      success: false,
      message: "Something went wrong...",
    };
  }
};
