import { Request } from "express";
import { IUser } from "../../../../interfaces";
import User from "../../../../models/User";
import { isAuth } from "../../../../security/isAuth";

export const getSuggestions = async (req: Request) => {
  const { isAuthorized, message, user, userId } = await isAuth(req);
  if (!isAuthorized) return { statusCode: 401, success: false, message };
  try {
    const users: IUser[] = await User.find({}).limit(20);

    const suggestions = users
      .filter((suggestion) => suggestion.id !== userId)
      .filter(
        (suggestion) => !user?.following.followingList.includes(suggestion.id)
      )
      .map((suggestion) => {
        return {
          id: suggestion.id,
          username: suggestion.username,
          profilePicture: suggestion.profilePicture,
          isFollowed: false,
        };
      });

    console.log(suggestions);
    return {
      statusCode: 200,
      success: true,
      message: "Found Suggestions",
      suggestions,
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      success: false,
      message: error.message,
      suggestions: null,
    };
  }
};

export default getSuggestions;
