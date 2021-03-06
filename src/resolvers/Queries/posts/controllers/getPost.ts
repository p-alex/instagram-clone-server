import { Types } from "mongoose";
import { IPost } from "../../../../interfaces";
import Post from "../../../../models/Post";
import User from "../../../../models/User";

export const getPost = async (postId: string, userId: string | null) => {
  try {
    if (!postId)
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

    let currentUserFollowing = userId
      ? await User.findById(
          {
            _id: userId,
          },
          { _id: 0, following: true }
        )
      : null;

    const checkIfPostIsLiked = (): boolean => {
      const convertedUserId = new Types.ObjectId(userId!).toString();
      return post.likes.users.includes(convertedUserId);
    };

    const isPostLiked = checkIfPostIsLiked();

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
      likes: {
        count: post.likes.count,
        users: [],
      },
      comments: post.comments,
      createdAt: post.createdAt,
      isLiked: userId ? isPostLiked : false,
      isPostOwnerFollowed: userId ? isPostOwnerFollowed() : false,
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
