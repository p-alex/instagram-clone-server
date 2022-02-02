import { Request } from 'express';
import { isAuth } from '../../Mutations/auth/isAuth';

export const getPosts = async (req: Request) => {
  const { authenticated, userId, message } = await isAuth(req);
  if (authenticated) {
    return [
      {
        id: '1',
        user: {},
        images: [],
        description: 'wow',
        likes: [],
        comments: [],
        postedAt: 1,
      },
    ];
  }
  return null;
};
