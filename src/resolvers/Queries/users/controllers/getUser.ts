import { Request } from 'express';
import { IUser, IUserProfileInfo } from '../../../../interfaces';
import User from '../../../../models/User';
export const getUser = async (
  username: string,
  req: Request
): Promise<{
  statusCode: number;
  success: boolean;
  message: string;
  user: IUserProfileInfo | null;
}> => {
  try {
    const user: IUser = await User.findOne({ username }).populate({
      path: 'posts.postsList',
    });
    if (!user)
      return { statusCode: 403, success: false, message: 'Forbidden', user: null };
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
        message: 'Found user',
        user: userProfileInfo,
      };
    }
  } catch (error: any) {
    return { statusCode: 500, success: false, message: error.message, user: null };
  }
  return { statusCode: 500, success: false, message: 'Something went wrong', user: null };
};
