import jwt from "jsonwebtoken";
import { HydratedDocument } from "mongoose";
import { IUser } from "../../../../interfaces";
import User from "../../../../models/User";

export const verifyResetPasswordToken = async (token: string) => {
  try {
    const tokenPayload = jwt.verify(
      token,
      process.env.RESET_PASSWORD_TOKEN_SECRET!
    ) as { email: string };

    if (!tokenPayload)
      return { statusCode: 401, success: false, message: "Invalid token" };

    const user: HydratedDocument<IUser> = await User.findOne({
      confirmationCode: token,
    });

    if (!user)
      return {
        statusCode: 401,
        success: false,
        message: "Invalid token",
      };

    if (user.status !== "Active") {
      user.confirmationCode = "";
      await user.save();
      return {
        statusCode: 401,
        success: false,
        message: "Unauthorized",
      };
    }

    return { statusCode: 200, success: true, message: "Authorized" };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      success: false,
      message: "Something went wrong...",
    };
  }
};
