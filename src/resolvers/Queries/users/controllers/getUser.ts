import { Request } from "express";
import { IUser } from "../../../../interfaces";
import User from "../../../../models/User";
export const getUser = async (
  username: string,
  authenticatedUserId: string | null,
  req: Request
) => {
  try {
    const user: IUser = await User.findOne({ username }).populate({
      path: "posts.postsList",
    });

    let isFollowed;

    if (user && authenticatedUserId !== null) {
      const followers = user.followers.followersList.filter((follower: any) => {
        return follower._id.toString() === authenticatedUserId;
      });
      isFollowed = followers.length > 0;
    }

    if (!user)
      return {
        statusCode: 404,
        success: false,
        message: "This user doesn't exist.",
        user: null,
        isFollowed: null,
      };

    if (user) {
      const userProfileInfo = {
        id: user.id,
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
    console.log(error);
    return {
      statusCode: 500,
      success: false,
      message: "Something went wrong...",
      user: null,
      isFollowed: false,
    };
  }
};
