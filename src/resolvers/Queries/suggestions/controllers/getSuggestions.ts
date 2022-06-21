import { Request } from "express";
import { IUser } from "../../../../interfaces";
import User from "../../../../models/User";
import { isAuth } from "../../../../security/isAuth";

export const getSuggestions = async (req: Request) => {
  const { isAuthorized, message, user, userId } = await isAuth(req);
  if (!isAuthorized) return { statusCode: 401, success: false, message };
  try {
    const users: IUser[] = await User.find({}).limit(25);

    if (!users)
      return {
        statusCode: 200,
        success: true,
        message: "Found Suggestions",
        suggestions: [],
      };

    const alexeyroSuggestion = users.find(
      (suggestions) => suggestions.username === "alexeyro"
    );

    let suggestions = users
      .filter((suggestion) => suggestion.id !== userId)
      .filter(
        (suggestion) => !user?.following.followingList.includes(suggestion.id)
      );

    // Making my profile appear first in the suggestions :)))))
    // After that i sort every other suggestion by date (newest to oldest)
    if (alexeyroSuggestion && alexeyroSuggestion.id !== userId) {
      const updatedSuggestions = suggestions
        .filter((suggestion) => suggestion.username !== "alexeyro")
        .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
      updatedSuggestions.unshift(alexeyroSuggestion);
      suggestions = updatedSuggestions;
    }

    suggestions.map((suggestion) => {
      return {
        id: suggestion.id,
        username: suggestion.username,
        profilePicture: suggestion.profilePicture,
        isFollowed: false,
      };
    });

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
