import { Request } from "express";
import { getFeedPosts } from "./controllers/getFeedPosts";
import { getPost } from "./controllers/getPost";
import { getMorePostsFromUser } from "./controllers/getMorePostsFromUser";

export default {
  getPost: (
    _: unknown,
    { postId, userId }: { postId: string; userId: string }
  ) => getPost(postId, userId),
  getFeedPosts: (
    _: unknown,
    {
      currentPage,
      maxPostsPerPage,
    }: { currentPage: number; maxPostsPerPage: number },
    { req }: { req: Request }
  ) => getFeedPosts(currentPage, maxPostsPerPage, req),
  getMorePostsFromUser: (
    _: unknown,
    { userId, currentPostId }: { userId: string; currentPostId: string }
  ) => getMorePostsFromUser(userId, currentPostId),
};
