import { Request } from 'express';
import { HydratedDocument } from 'mongoose';
import { IPost } from '../../../../interfaces';
import Post from '../../../../models/Post';
import { isAuth } from '../../../../security/isAuth';

export const likePost = async ({
  uid,
  postId,
  req,
}: {
  uid: string;
  postId: string;
  req: Request;
}) => {
  const { isAuthorized, message, userId } = await isAuth(req);
  if (isAuthorized && userId === uid) {
    try {
      const post: HydratedDocument<IPost> = await Post.findById({ _id: postId });
      if (post?.id) {
        post.likes.users.unshift(uid);
        const response = await post.save();
        console.log(response);
      }
    } catch (error) {}
  }
};
