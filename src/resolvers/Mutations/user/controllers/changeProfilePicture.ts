import { Request } from "express";
import { isAuth } from "../../../../security/isAuth";
import { cloudinary } from "../../../../utils/cloudinary";
import { extractPublicId } from "../../../../utils/extract-public-id";

export const changeProfilePicture = async (image: string, req: Request) => {
  const { isAuthorized, user, message } = await isAuth(req);
  try {
    if (!isAuthorized || !user)
      return {
        statusCode: 401,
        success: false,
        message,
        newImageUrl: null,
      };

    await cloudinary.api.delete_resources([
      extractPublicId(user.profilePicture.fullPicture),
      extractPublicId(user.profilePicture.smallPicture),
    ]);

    const uploadFullPicture = await cloudinary.uploader.upload(image, {
      upload_preset: process.env.CLOUDINARY_PROFILE_PIC_UPLOAD_PRESET,
      transformation: [
        { width: 325, height: 325, crop: "fill", gravity: "face" },
      ],
    });

    const uploadSmallPicture = await cloudinary.uploader.upload(image, {
      upload_preset: process.env.CLOUDINARY_PROFILE_PIC_UPLOAD_PRESET,
      transformation: [
        { width: 120, height: 120, crop: "fill", gravity: "face" },
      ],
    });

    if (!uploadFullPicture.secure_url || !uploadSmallPicture.secure_url)
      throw new Error("Couldn't upload image");

    user.profilePicture.fullPicture = uploadFullPicture.secure_url;
    user.profilePicture.smallPicture = uploadSmallPicture.secure_url;

    await user.save();

    return {
      statusCode: 200,
      success: true,
      message: "Profile picture changed",
      newFullPictureUrl: uploadFullPicture.secure_url,
      newSmallPictureUrl: uploadSmallPicture.secure_url,
    };
  } catch (error: any) {
    console.log(error);
    return {
      statusCode: 500,
      success: false,
      message: "Something went wrong...",
      newImageUrl: null,
    };
  }
};
