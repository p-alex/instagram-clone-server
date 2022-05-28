import { Request } from "express";
import { IPost } from "../../../../interfaces";
import Post from "../../../../models/Post";
import { isAuth } from "../../../../security/isAuth";

export const getFeedPosts = async (
  currentPage: number,
  maxPostsPerPage: number,
  req: Request
) => {
  const { isAuthorized, message, user, convertedUserId } = await isAuth(req);
  if (!isAuthorized || !user) throw new Error(message);
  try {
    let posts: IPost[] = await Post.find({
      user: { $in: user.following.followingList },
    })
      .skip(maxPostsPerPage * currentPage)
      .limit(maxPostsPerPage)
      .populate("user", "id username profilePicture")
      .sort({ createdAt: -1 });

    // Adding isLiked boolean to every post
    const updatedPosts = posts.map((post) => {
      return {
        id: post.id,
        user: post.user,
        images: post.images,
        description: post.description,
        likes: post.likes,
        comments: post.comments,
        createdAt: post.createdAt,
        isLiked: post.likes.users.includes(convertedUserId!.toString()),
      };
    });

    return {
      statusCode: 200,
      success: true,
      message: "Found posts!",
      posts: updatedPosts,
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      success: false,
      message: error.message,
      posts: null,
    };
  }
};
