import { HydratedDocument } from "mongoose";
import { IPost, IUser } from "../../../../interfaces";
import User from "../../../../models/User";

export const getMorePostsFromUser = async (
  userId: string,
  currentPostId: string
) => {
  try {
    const user: HydratedDocument<IUser> = await User.findById({
      _id: userId,
    })
      .populate({ path: "posts.postsList" })
      .limit(7);
    if (!user) throw new Error();
    let filteredPosts: IPost[] = user.posts.postsList.filter(
      (post) => post.id !== currentPostId
    );
    if (filteredPosts.length > 6) {
      filteredPosts = filteredPosts.slice(0, 6);
    }
    return {
      statusCode: 200,
      success: true,
      message: "More profile posts found",
      posts: filteredPosts,
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      success: false,
      messsage: "Something went wrong",
      posts: null,
    };
  }
};
