import { Request } from "express";
import { createPost } from "./controllers/createPostController";
import { deletePost } from "./controllers/deletePostController";
import { likeOrDislikePost } from "./controllers/likePostController";

export interface ICreatePostBody {
  caption: string;
  image: string;
  aspectRatio: number;
}

export default {
  createPost: (
    _: unknown,
    { caption, image, aspectRatio }: ICreatePostBody,
    { req }: { req: Request }
  ) => createPost({ image, caption, aspectRatio }, req),
  likeOrDislikePost: (
    _: unknown,
    { postId }: { postId: string },
    { req }: { req: Request }
  ) => likeOrDislikePost({ postId, req }),
  deletePost: (
    _: unknown,
    { postId }: { postId: string },
    { req }: { req: Request }
  ) => deletePost(postId, req),
};
