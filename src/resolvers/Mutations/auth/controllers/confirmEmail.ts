import { HydratedDocument } from "mongoose";
import { IUser } from "../../../../interfaces";
import User from "../../../../models/User";

export const confirmEmail = async (confirmationCode: string) => {
  try {
    const user: HydratedDocument<IUser> = await User.findOne({
      confirmationCode,
    });

    if (!user)
      return { statusCode: 404, success: false, message: "User doesn't exist" };

    console.log(user);

    user.status = "Active";
    user.confirmationCode = " ";

    await user.save();

    return { statusCode: 200, success: true, message: "Email confirmed!" };
  } catch (error: any) {
    return {
      statusCode: 500,
      success: false,
      message: "Something went wrong...",
    };
  }
};
