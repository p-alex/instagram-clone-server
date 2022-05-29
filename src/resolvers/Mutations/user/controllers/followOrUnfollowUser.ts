import { Request } from "express";
import User from "../../../../models/User";
import { isAuth } from "../../../../security/isAuth";

export const followOrUnfollowUser = async (
  userId: string,
  type: "Follow" | "Unfollow",
  req: Request
) => {
  const { isAuthorized, message, user } = await isAuth(req);
  if (!isAuthorized)
    return { statusCode: 401, success: false, message, reply: null };
  try {
    if (type === "Follow") {
      // update userToFollow's followers list
      await User.findByIdAndUpdate(
        { _id: userId },
        {
          $inc: { "followers.count": 1 },
          $push: { "followers.followersList": user!.id },
        }
      );
      // update currentUser's following list
      await User.findByIdAndUpdate(
        { _id: user!.id },
        {
          $inc: { "following.count": 1 },
          $push: { "following.followingList": userId },
        }
      );
      return {
        statusCode: 200,
        success: true,
        message: "User followed successfully",
      };
    } else if (type === "Unfollow") {
      // update userToFollow's followers list
      await User.findByIdAndUpdate(
        { _id: userId },
        {
          $inc: { "followers.count": -1 },
          $pull: { "followers.followersList": user!.id },
        }
      );
      // update currentUser's following list
      await User.findByIdAndUpdate(
        { _id: user!.id },
        {
          $inc: { "following.count": -1 },
          $pull: { "following.followingList": userId },
        }
      );
      return {
        statusCode: 200,
        success: true,
        message: "User unfollowed successfully",
      };
    }
  } catch (error: any) {
    return { statusCode: 500, success: false, message: error.message };
  }
};

export default followOrUnfollowUser;
