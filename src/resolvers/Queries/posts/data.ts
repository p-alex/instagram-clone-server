import { Request } from 'express';
import { isAuth } from '../../../security/isAuth';

export const getPosts = async (req: Request) => {
  const { isAuthorized, userId, message } = await isAuth(req);
  if (isAuthorized) {
    return {
      statusCode: 200,
      success: true,
      message: message,
      posts: [
        {
          id: '1',
          user: {},
          images: [],
          description: 'wow',
          likes: [],
          comments: [],
          postedAt: 1,
        },
      ],
    };
  }
  return {
    statusCode: 401,
    success: false,
    message: message,
    posts: null,
  };
};
