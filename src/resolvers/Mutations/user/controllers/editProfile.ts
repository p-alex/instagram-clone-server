import { Request } from "express";
import { isAuth } from "../../../../security/isAuth";
import { replaceBlankLines } from "../../../../utils/replaceBlankLines";

export const editProfile = async (
  fullname: string,
  username: string,
  bio: string,
  req: Request
) => {
  const { isAuthorized, user, message } = await isAuth(req);
  try {
    if (!isAuthorized || !user)
      return { statusCode: 401, success: false, message };

    user.fullname = fullname;
    user.username = username;
    user.bio = replaceBlankLines(bio);

    console.log(replaceBlankLines(bio));

    await user.save();

    return { statusCode: 200, success: false, message: "Profile changed" };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      success: false,
      message: "Something went wrong",
    };
  }
};
