import { Request } from "express";
import { isAuth } from "../../../../security/isAuth";
import { cloudinary } from "../../../../utils/cloudinary";
import { extractPublicId } from "../../../../utils/extract-public-id";

export const removeProfilePicture = async (req: Request) => {
  const { isAuthorized, user, message } = await isAuth(req);
  try {
    if (!isAuthorized || !user)
      return {
        statusCode: 401,
        success: false,
        message,
        newPictureUrl: null,
      };

    if (
      user.profilePicture.fullPicture === "/images/default-profile-picture.jpg"
    ) {
      return {
        statusCode: 400,
        success: false,
        message: "Profile picture is already removed",
        newPictureUrl: null,
      };
    }

    await cloudinary.api.delete_resources([
      extractPublicId(user.profilePicture.fullPicture),
      extractPublicId(user.profilePicture.smallPicture),
    ]);

    user.profilePicture.fullPicture = "/images/default-profile-picture.jpg";
    user.profilePicture.smallPicture = "/images/default-profile-picture.jpg";

    await user.save();

    return {
      statusCode: 200,
      success: true,
      message: "Profile picture removed",
      newPictureUrl: "/images/default-profile-picture.jpg",
    };
  } catch (error: any) {
    console.log(error);
    return {
      statusCode: 500,
      success: false,
      message: "Something went wrong...",
      newPictureUrl: null,
    };
  }
};
