import { Types } from "mongoose";
import { IPost } from "../../../../interfaces";
import Post from "../../../../models/Post";
import User from "../../../../models/User";

export const getPost = async (postId: string, userId: string | null) => {
  try {
    if (!postId || !userId)
      return {
        statusCode: 401,
        success: false,
        message: "No post id or user id provided",
        post: null,
      };

    let post: IPost = await Post.findById({ _id: postId }).populate(
      "user",
      "id username profilePicture"
    );

    let currentUserFollowing = await User.findById(
      {
        _id: userId,
      },
      { _id: 0, following: true }
    );

    const isPostLiked = (): boolean => {
      const convertedUserId = new Types.ObjectId(userId).toString();
      if (post.likes.users.includes(convertedUserId)) return true;
      return false;
    };

    const isPostOwnerFollowed = (): boolean => {
      if (
        currentUserFollowing.following.followingList.indexOf(post.user.id) >= 0
      )
        return true;
      return false;
    };

    // Adding isLiked boolean to every post
    const updatedPost = {
      id: post.id,
      user: post.user,
      images: post.images,
      description: post.description,
      likes: post.likes,
      comments: post.comments,
      createdAt: post.createdAt,
      isLiked: isPostLiked(),
      isPostOwnerFollowed: isPostOwnerFollowed(),
    };

    if (!post)
      return {
        statusCode: 401,
        success: false,
        message: "That post doesn't exist",
        post: null,
      };
    return {
      statusCode: 200,
      success: true,
      message: "Post found",
      post: updatedPost,
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      success: false,
      message: error.message,
      post: null,
    };
  }
};
