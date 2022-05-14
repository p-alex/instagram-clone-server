import { Request } from "express";
import { IUser, IUserProfileInfo } from "../../../../interfaces";
import User from "../../../../models/User";
export const getUser = async (
  username: string,
  authenticatedUserId: string | null,
  req: Request
): Promise<{
  statusCode: number;
  success: boolean;
  message: string;
  user: IUserProfileInfo | null;
  isFollowed: boolean | null;
}> => {
  try {
    const user: IUser = await User.findOne({ username }).populate({
      path: "posts.postsList",
    });

    let isFollowed;

    if (authenticatedUserId !== null) {
      const followers = user.followers.followersList.map((follower: any) => {
        return follower._id.toString();
      });
      isFollowed = followers.includes(authenticatedUserId);
    }

    if (!user)
      return {
        statusCode: 403,
        success: false,
        message: "Forbidden",
        user: null,
        isFollowed: null,
      };
    if (user) {
      const userProfileInfo = {
        userId: user.id,
        profilePicture: user.profilePicture,
        fullname: user.fullname,
        username: user.username,
        bio: user.bio,
        followers: user.followers,
        following: user.following,
        posts: {
          count: user.posts.count,
          postsList: user.posts.postsList,
        },
      };
      return {
        statusCode: 200,
        success: true,
        message: "Found user",
        user: userProfileInfo,
        isFollowed: isFollowed === undefined ? null : isFollowed,
      };
    }
  } catch (error: any) {
    return {
      statusCode: 500,
      success: false,
      message: error.message,
      user: null,
      isFollowed: false,
    };
  }
  return {
    statusCode: 500,
    success: false,
    message: "Something went wrong",
    user: null,
    isFollowed: false,
  };
};
