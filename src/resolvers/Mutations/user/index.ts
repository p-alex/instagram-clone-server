import { Request } from 'express';
import followOrUnfollowUser from './controllers/followOrUnfollowUser';

export default {
  followOrUnfollowUser: (
    _: unknown,
    { userId, type }: { userId: string; type: 'Follow' | 'Unfollow' },
    { req }: { req: Request }
  ) => followOrUnfollowUser(userId, type, req),
};
